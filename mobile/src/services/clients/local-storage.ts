import AsyncStorage from "@react-native-async-storage/async-storage";

export const LocalStorage = {
  setItem<T extends object>(key: string, value: string | T): Promise<void> {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  },
  getItem<T>(key: string): Promise<T | null> {
    return AsyncStorage.getItem(key).then((data) =>
      data ? JSON.parse(data) : null
    );
  },
};
