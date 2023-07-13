import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * The above code defines two functions, `storeData` and `getData`, that can be used to store and
 * retrieve data from AsyncStorage in JavaScript.
 * @param key - The key parameter is a string that represents the unique identifier for the data you
 * want to store or retrieve from AsyncStorage. It is used to associate a value with a specific key in
 * the storage.
 * @param value - The value parameter is the data that you want to store in AsyncStorage. It can be of
 * any type, such as a string, number, object, or array.
 */
export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log('Error storing value: ', error);
  }
};


export const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.log('Error retrieving value: ', error);
    }
};