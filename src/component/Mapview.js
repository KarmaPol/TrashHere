import React, {useState} from 'react';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import styled, {ThemeProvider} from 'styled-components/native';
import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';

const CustomMap = ({location}) => {
  let latitude = location.latitude;
  let longitude = location.longitude;
    return (
        <MapView style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,}} 
            initialRegion={
            { latitude: {latitude}, 
              longitude: {longitude},
              latitudeDelta: 10, 
              longitudeDelta: 10, }}>
            {/* <CustomMarker latitude = {location.latitude} longitude = {location.longitude}/> */}
          </MapView>
    );
};

CustomMap.propTypes = {
  location: PropTypes.object.isRequired,
};

export default CustomMap;