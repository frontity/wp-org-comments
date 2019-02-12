import { types, getRoot } from 'mobx-state-tree';
import * as languages from './languages';

export default types
  .model('Lang')
  .props({
    default: types.frozen(languages.en),
  })
  .views(self => ({
    get root() {
      return getRoot(self);
    },
    get code() {
      return self.root.settings.theme.lang;
    },
    get current() {
      return languages[self.code] || {};
    },
    get(key) {
      return self.current[key] || self.default[key];
    },
  }));
