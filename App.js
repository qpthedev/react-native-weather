import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";
import { API_KEY } from "@env";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Match icons with possible weather outcomes
const icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Rain: "rains",
  Drizzle: "rain",
  Snow: "snow",
  Thunderstorm: "lightning",
  Atmosphere: "cloudy-gusts",
};

export default function App() {
  const [ok, setOk] = useState(true);
  const [days, setDays] = useState([]);
  const [city, setCity] = useState("Loading");

  const getWeather = async () => {
    // request location permission to user
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if (!granted) {
      setOk(false);
    }

    const {
      // get latitude and longitude data
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );

    setCity(location[0].city);

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts,minute,hourlyly&units=imperial&appid=${API_KEY}`
    );

    const json = await response.json();
    setDays(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.weather}
        horizontal
        pagingEnabled
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(1)}°
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={45}
                  color="white"
                />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.smallText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD500",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 45,
    fontWeight: "bold",
    color: "white",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  temp: {
    marginTop: 50,
    fontSize: 100,
    fontWeight: "bold",
    color: "white",
  },
  description: {
    marginTop: -10,
    fontSize: 60,
    fontWeight: "500",
    color: "white",
  },
  smallText: {
    marginTop: -10,
    fontSize: 25,
    fontWeight: "500",
    color: "white",
  },
});
