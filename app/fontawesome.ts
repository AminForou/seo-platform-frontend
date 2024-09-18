// app/fontawesome.ts

import { config, library } from '@fortawesome/fontawesome-svg-core';
import {
  faGlobe,
  faUsers,
  faToolbox,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import {
  faLinkedinIn,
  faYoutube,
  faChrome,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';

config.autoAddCss = false;

library.add(
  faGlobe,
  faUsers,
  faToolbox,
  faEnvelope,
  faLinkedinIn,
  faXTwitter,
  faYoutube,
  faChrome
);
