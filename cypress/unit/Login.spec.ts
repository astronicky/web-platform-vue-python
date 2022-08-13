import { shallowMount } from '@vue/test-utils';
import Login from '@/views/Login.vue';

describe('Login.vue', () => {
  it('renders Login button', () => {
    const wrapper = shallowMount(Login);
    expect(wrapper.contains('[data-testid="login"]')).to.equal(true);
  });
});
