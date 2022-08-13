import http from '@/common/http';
import { Ability, RawRuleOf, ForcedSubject } from '@casl/ability';

export async function getRules(userID, organizationID) {
  const actions = ['*:*'] as const;
  const subjects = ['Organization', 'all'] as const;

  type Abilities = [
    typeof actions[number],
    typeof subjects[number] | ForcedSubject<Exclude<typeof subjects[number], 'all'>>
  ];

  type AppAbility = Ability<Abilities>;

  const response = await http.get(`iam/user/${userID}/permissions/${organizationID}?format=casl`);
  const rules = response.data;

  return new Ability<Abilities>(rules);
}
