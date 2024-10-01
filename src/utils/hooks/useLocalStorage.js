import { useState } from "react";

import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from "utils/localStorage";

export function useLocalStorage(key) {
  const [value, setValue] = useState(getStorageItem(key));

  const update = (newValue) => {
    setStorageItem(key, newValue);
    setValue(newValue);
  };

  const remove = () => {
    removeStorageItem(key);
    setValue();
  };

  return { value, update, remove };
}
