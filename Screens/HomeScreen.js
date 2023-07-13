import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MagnifyingGlassIcon, XMarkIcon} from 'react-native-heroicons/outline';
import {
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon,
} from 'react-native-heroicons/solid';
import {debounce} from 'lodash';
import {theme} from '../theme';
import {fetchLocations, fetchWeatherForecast} from '../api/weather';
import * as Progress from 'react-native-progress';
import Group from '../assets/images/Group.svg';
import F from '../assets/images/F.svg';
import {weatherImages} from '../constants';
import {getData, storeData} from '../utils/asyncStorage';

export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [convert, setConvert] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState({});
const [sunset,setsunset]=useState("");
/**
 * The function `handleSearch` takes a search input and fetches locations based on the input if it is
 * longer than 2 characters.
 */
  const handleSearch = search => {
    // console.log('value: ',search);
    if (search && search.length > 2)
      fetchLocations({cityName: search}).then(data => {
        // console.log('got locations: ',data);
        setLocations(data);
      });
  };

  /**
   * The function `handleLocation` takes a location as input, sets loading to true, toggles search to
   * false, clears the locations array, fetches weather forecast data for the given location, sets
   * loading to false, sets the weather data, and stores the city name in local storage.
   */
  const handleLocation = loc => {
    setLoading(true);
    toggleSearch(false);
    setLocations([]);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '10',
    }).then(data => {
      setLoading(false);
      setWeather(data);
      storeData('city', loc.name);
      
    });
  };

  useEffect(() => {
    fetchMyWeatherData();

    getConvertValue();
  }, [sunset]);
  const getConvertValue = async () => {
    const value = await getData('convert');
    if (value !== null) {
      setConvert(value === 'true');
    }
  };
/**
 * The function `GJ` toggles the value of `convert` and stores the updated value in local storage.
 */
  const GJ = async () => {
    const newValue = !convert;
    setConvert(newValue);

    storeData('convert', newValue.toString());
  };

 /**
  * The function fetchMyWeatherData fetches weather forecast data for a specified city, sets the
  * weather state, and updates the sunset time.
  */
  const fetchMyWeatherData = async () => {
    let myCity = await getData('city');
    let cityName = 'Dubai';
    if (myCity) {
      cityName = myCity;
    }
    fetchWeatherForecast({
      cityName,
      days: '7',
    }).then(data => {
      // console.log('got data: ',data.forecast.forecastday);
      setWeather(data);
      setLoading(false);
      const sunsetTime = data?.forecast?.forecastday[0]?.astro?.sunset;
      setsunset(sunsetTime);
    });
  };

  
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const {location, current} = weather;


let timeString = sunset
let [hourString,  period] = timeString.split(/:| /);
let w = parseInt(hourString, 10);

/* The above code is checking the time of day (AM or PM) and the current weather conditions to
determine the appropriate weather icon to display. It first checks if it is PM and the hour is not
12, in which case it adds 12 to the hour. Then, it checks if it is AM and the hour is 12, in which
case it sets the hour to 0. */
if (period === 'PM' && w !== 12) {
  w += 12;
} else if (period === 'AM' && hour === 12) {
  w = 0;
}
  let date = new Date(location?.localtime);
                let options = {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                };
                let dayName = date.toLocaleDateString('en-US', options);
                const hour = date.getHours();
                const amPm = dayName.slice(-2);
                dayName = dayName.split(' ')[1];

                let weatherIcon = current?.condition?.text;
                if (
                  amPm === 'AM' &&
                  hour < w &&
                  current?.condition.text === 'Clear' 
                ) {
                  weatherIcon = 'Moon';
                } else if (
                  amPm === 'AM' &&
                  hour < w && current?.condition.text === 'Partly cloudy' 
                ) {
                  weatherIcon = 'cloudyNight';
                } else if ( hour > w && current?.condition.text === 'cloudyNight'){
                  weatherIcon = 'cloudyNight';
                } else if (amPm === "PM" &&  hour > w &&
                current?.condition.text === 'Clear' ){
                  weatherIcon = 'Moon';
                }else if (amPm === "PM" &&  hour > w && current?.condition.text === 'Patchy rain possible') {
                  weatherIcon = 'Light drizzle';
                }else if ( amPm === "PM" && current?.condition.text  === 'Partly cloudy' &&  hour > w){
                  weatherIcon = 'cloudyNight';
                }  
                
  return (
    
    <View className="flex-1 relative">
      <StatusBar backgroundColor={'#0A3239'} />
   
      <Image
        blurRadius={70}
        source={require('../assets/images/bg.png')}
        className="absolute w-full h-full"
      />
      {loading ? (
        <View className="flex-1 flex-row justify-center items-center">
          <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
        </View>
      ) : (
        <ScrollView className="flex flex-1">
          {/* search section */}
          <View style={{height: '7%'}} className="mx-4 relative mt-4 z-50">
            <View
              className="flex-row justify-between items-center rounded-full"
              style={{
                backgroundColor: showSearch
                  ? theme.bgWhite(0.2)
                  : 'transparent',
              }}>
              {showSearch ? (
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder={"Search city"}
                  placeholderTextColor={'lightgray'}
                  className="pl-6 h-10  flex-1 text-base text-white"
                />
              ) : null}
              {showSearch ? null : (
                <TouchableOpacity
                  onPress={() => GJ()}
                  className="rounded-full p-3 m-1"
                  style={{backgroundColor: theme.bgWhite(0.3)}}>
                  {convert ? (
                    <F width={25} height={25} color="white" />
                  ) : (
                    <Group width={25} height={25} color="white" />
                  )}
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => toggleSearch(!showSearch)}
                className="rounded-full p-3 m-1"
                style={{backgroundColor: theme.bgWhite(0.3)}}>
                {showSearch ? (
                  <XMarkIcon size="25" color="white" />
                ) : (
                  <MagnifyingGlassIcon size="25" color="white" />
                )}
              </TouchableOpacity>
            </View>
            {locations.length > 0 && showSearch ? (
              <View className="absolute w-full bg-gray-300 top-16 rounded-3xl ">
                {locations.map((loc, index) => {
                  let showBorder = index + 1 != locations.length;
                  let borderClass = showBorder
                    ? ' border-b-2 border-b-gray-400'
                    : '';
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleLocation(loc)}
                      className={
                        'flex-row items-center border-0 p-3 px-4 mb-1 ' +
                        borderClass
                      }>
                      <MapPinIcon size="20" color="gray" />
                      <Text className="text-black text-lg ml-2">
                        {loc?.name}, {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>

          {/* forecast section */}
          <View className="mx-4 flex justify-around flex-1 mb-2">
            {/* location */}
            <Text className="text-white text-center text-2xl font-bold">
              {location?.name},
              <Text className="text-lg font-semibold text-gray-300">
                {location?.country}
              </Text>
            </Text>
            {/* weather icon */}
            <View className="flex-row justify-center mt-5 ">

             {
              <Image
              // source={{uri: 'https:'+current?.condition?.icon}}
              source={weatherImages[weatherIcon || 'other']}
              className="w-52 h-52"
            />
             } 
            </View>
            {/* degree celcius */}
            <View className="space-y-2">
              <Text className="text-center font-bold text-white text-6xl ml-5 mt-5">
                {convert ? current?.temp_f : current?.temp_c}&#176;
              </Text>
              <Text className="text-center text-white text-xl tracking-widest">
                {current?.condition?.text}
              </Text>
            </View>

            {/* other stats */}
            <View className="flex-row justify-between mx-4 mt-4">
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require('../assets/icons/wind.png')}
                  className="w-6 h-6"
                />
                <Text className="text-white font-semibold text-base">
                  {current?.wind_kph}km
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require('../assets/icons/drop.png')}
                  className="w-6 h-6"
                />
                <Text className="text-white font-semibold text-base">
                  {current?.humidity}%
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require('../assets/icons/sun.png')}
                  className="w-6 h-6"
                />
                <Text className="text-white font-semibold text-base">
                  {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
          </View>

          {/* forecast for hour */}
          <View className="mb-2 space-y-3 mt-6  ">
            <View className="flex-row items-center mx-5 space-x-2 ">
              <ClockIcon size={'22'} color="white" />
              <Text className="text-white text-base">Hourly forecast</Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{paddingHorizontal: 15}}
              showsHorizontalScrollIndicator={false}>
              {weather?.forecast?.forecastday[0]?.hour.map((item, index) => {
                const dateObj = new Date(current?.last_updated);
                const countryH = dateObj.getHours();
                let timeString = weather?.forecast?.forecastday[0]?.astro?.sunset; // Example time string

                let [hourString, minuteString, period] = timeString.split(/:| /);
                let AM = parseInt(hourString, 10);
                
                if (period === 'PM' && AM !== 12) {
                  AM += 12;
                } else if (period === 'AM' && hour === 12) {
                  AM = 0;
                }
                let timeStringg = weather?.forecast?.forecastday[0]?.astro?.sunrise; // Example time string

                let [hourStringg, minuteStringg, periodd] = timeString.split(/:| /);
                let PM = parseInt(hourStringg, 10);
                
                if (periodd === 'PM' && PM !== 12) {
                  PM += 12;
                } else if (period === 'AM' && hour === 12) {
                  PM = 0;
                }

                let date = new Date(item.time);
                let options = {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                };
                let dayName = date.toLocaleDateString('en-US', options);
                const hour = date.getHours();
                const amPm = dayName.slice(-2);
                dayName = dayName.split(' ')[1];
                let HourlyTime = dayName+" "+amPm
                if (hour === countryH) {
                  HourlyTime="Now"
                }
                  // Check if the current hour is greater than or equal to the current time
                  if (hour >= countryH) {
                   

                    let weatherIcon = item?.condition?.text;
                    if (
                      amPm === 'AM' &&
                      hour < PM &&
                      item.condition.text === 'Clear' 
                    ) {
                      weatherIcon = 'Moon';
                    } else if (
                      amPm === 'AM' &&
                      hour < PM
                      && item.condition.text === 'cloudyNight'
                    ) {
                      weatherIcon = 'cloudyNight';
                    } else if ( amPm === "PM" && item.condition.text === 'Partly cloudy' &&  hour > AM){
                      weatherIcon = 'cloudyNight';
                    }
                    
                    else if (amPm === "AM" && item.condition.text === 'Partly cloudy' &&  hour < PM) {
                      weatherIcon = 'cloudyNight';
                    } else if (amPm === "PM" && item.condition.text === 'Patchy rain possible' &&  hour > AM){
                      weatherIcon = 'Light drizzle';
                    }
                  else if (amPm === "AM" && item.condition.text === 'Patchy rain possible' &&  hour < AM){
                    weatherIcon = 'Light drizzle';
                  } 
                  else if (amPm === "PM" && item.condition.text === 'Clear' &&  hour > AM) {
                    weatherIcon = 'Moon'
                  }
                  
               

                 
                    return (
                      <View
                        key={index}
                        className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                        style={{backgroundColor: theme.bgWhite(0.15)}}>
                   
                        <Image
                          source={weatherIcon === null?{uri: 'https:' + item?.condition?.icon}:weatherImages[weatherIcon]}
                          className="h-9 w-9 mb-2"
                        />
                    
                        <Text className="text-white">{HourlyTime}</Text>
                        <Text className="text-white  font-semibold mt-3 text-xl">
                          {convert ? item?.temp_f : item?.temp_c}&#176;
                      
                        </Text>
                      </View>
                    );
                  }
              
               
              })}
              {/* {forcast next day hour} */}
              {weather?.forecast?.forecastday[1]?.hour.map((item, index) => {
                
                let timeString = weather?.forecast?.forecastday[0]?.astro?.sunset; // Example time string
                const dateObj = new Date(current?.last_updated);
                const countryH = dateObj.getHours();
                let [hourString, minuteString, period] = timeString.split(/:| /);
                let AM = parseInt(hourString, 10);
                
                if (period === 'PM' && AM !== 12) {
                  AM += 12;
                } else if (period === 'AM' && hour === 12) {
                  AM = 0;
                }
                let timeStringg = weather?.forecast?.forecastday[0]?.astro?.sunrise; // Example time string

                let [hourStringg, minuteStringg, periodd] = timeString.split(/:| /);
                let PM = parseInt(hourString, 10);
                
                if (period === 'PM' && PM !== 12) {
                  PM += 12;
                } else if (period === 'AM' && hour === 12) {
                  PM = 0;
                }

                let date = new Date(item.time);
                let options = {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                };
                let dayName = date.toLocaleDateString('en-US', options);
                const hour = date.getHours();
                const amPm = dayName.slice(-2);
                dayName = dayName.split(' ')[1];
                let HourlyTime = dayName+" "+amPm
             
                  // Check if the current hour is greater than or equal to the current time
                  if (hour <= countryH) {
                   
                   
                    let weatherIcon = item?.condition?.text;
                    if (
                      amPm === 'AM' &&
                      hour < PM &&
                      item.condition.text === 'Clear' 
                    ) {
                      weatherIcon = 'Moon';
                    } else if (
                      amPm === 'AM' &&
                      hour < PM
                      && item.condition.text === 'cloudyNight'
                    ) {
                      weatherIcon = 'cloudyNight';
                    } else if ( amPm === "PM" && item.condition.text === 'Partly cloudy' &&  hour > AM){
                      weatherIcon = 'cloudyNight';
                    }
                    
                    else if (amPm === "AM" && item.condition.text === 'Partly cloudy' &&  hour < PM) {
                      weatherIcon = 'cloudyNight';
                    } else if (amPm === "PM" && item.condition.text === 'Patchy rain possible' &&  hour > AM){
                      weatherIcon = 'Light drizzle';
                    }
                  else if (amPm === "AM" && item.condition.text === 'Patchy rain possible' &&  hour < AM){
                    weatherIcon = 'Light drizzle';
                  } 
                  else if (amPm === "PM" && item.condition.text === 'Clear' &&  hour > AM) {
                    weatherIcon = 'Moon'
                  }
                  //
                 
                    return (
                      <View
                        key={index}
                        className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                        style={{backgroundColor: theme.bgWhite(0.15)}}>
                      <Image
                          source={weatherImages[weatherIcon || "Light drizzle"]}
                          className="h-9 w-9 mb-2"
                        />
                        <Text className="text-white">{HourlyTime}</Text>
                        <Text className="text-white  font-semibold mt-3 text-xl">
                          {convert ? item?.temp_f : item?.temp_c}&#176;
                        </Text>
                      </View>
                    );
                  }
              
               
              })}
            </ScrollView>
          </View>
          {/* forecast for next days */}
          <View className="mb-2 space-y-3">
            <View className="flex-row items-center mx-5 space-x-2">
              <CalendarDaysIcon size="22" color="white" />
              <Text className="text-white text-base">Daily forecast</Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{paddingHorizontal: 15}}
              showsHorizontalScrollIndicator={false}>
              {weather?.forecast?.forecastday?.map((item, index) => {
                const date = new Date(item.date);
                const options = {weekday: 'long'};
                let dayName = date.toLocaleDateString('en-US', options);
                dayName = dayName.split(',')[0];

                return (
                  <View
                    key={index}
                    className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                    style={{backgroundColor: theme.bgWhite(0.15)}}>
                    <Image
                      // source={{uri: 'https:'+item?.day?.condition?.icon}}
                      source={
                        weatherImages[item?.day?.condition?.text || 'other']
                      }
                      className="w-11 h-11"
                    />
                    <Text className="text-white">{dayName}</Text>
                    <Text className="text-white text-xl font-semibold">
                      {convert ? item?.day?.avgtemp_f : item?.day?.avgtemp_c}
                      &#176;
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
