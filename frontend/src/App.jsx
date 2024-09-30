import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const center = [13.838510043535697, 100.02535680572677];
  const [stores, setStores] = useState([]);
  const [myLocation, setMyLocation] = useState({
    lat: "",
    lng: "",
  });
  const apiURL = import.meta.env.VITE_BASE_API;

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMyLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  // Create new component in the same file
  const LocationMap = () => {
    useMapEvent({
      click(e) {
        const { lat, lng } = e.latlng;
        setMyLocation({ lat, lng });
      },
    });
    return (
      <Marker position={[myLocation.lat, myLocation.lng]}>
        <Popup>My current location</Popup>
      </Marker>
    );
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(apiURL + "/api/stores");
        console.log(response.data);
        if (response.status === 200) {
          setStores(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchStores();
  }, []);

  return (
    <div className="p-3">
      <h1 className="text-center text-3xl font-bold mb-3">
        Store Delivery Zone Checker
      </h1>
      <div className="flex justify-center items-center mx-auto mb-3 space-x-2">
        <button onClick={handleGetLocation} className="btn btn-ghost">
          Get location
        </button>
        <button className="btn btn-outline">Check zone</button>
      </div>
      <div className="flex justify-center items-center mx-auto">
        {" "}
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "85vh", width: "90vw" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[myLocation.lat, myLocation.lng]}>
            <Popup>My current location</Popup>
          </Marker>
          {stores &&
            stores.map((store) => {
              return (
                <Marker position={[store.lat, store.lng]}>
                  <Popup>
                    <b>{store.name}</b>
                    <p>{store.address}</p>
                    <p>{store.id}</p>
                  </Popup>
                </Marker>
              );
            })}
          {/* Use Location here */}
          <LocationMap />
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
