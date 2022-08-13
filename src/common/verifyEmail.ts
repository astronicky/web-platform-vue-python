// This is a beforeEnter on certain routes
import Router, { Route } from 'vue-router';


function isVerified(): boolean {
  // TODO: return from identify provider
  return true;
}

const requireEmail = (to: Route, from: Route, next: any) => {
  const forward = to.fullPath;
  // Base64 encode the destination
  const path = `/settings/verifyemail/${btoa(forward)}`;
  // check is email is verified
  if (!isVerified()) {
    // Email not verified
    next({ path });
  } else {
    // Email verified, continue
    next({ to });
  }
};

export default { requireEmail };
