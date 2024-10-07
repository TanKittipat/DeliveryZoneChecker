import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import LocationMap from "./components/LocationMap";
import StoreLocation from "./components/StoreLocation";

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

  const [deliveryZone, setDeliveryZone] = useState({
    lat: "",
    lng: "",
    radius: 0,
  });

  // function to calculate distance between 2 points using Haversine Formular
  const calculateDistance = (lat1, lat2, lng1, lng2) => {
    const R = 6371e3; // Earth radius in meters
    const phi_1 = (lat1 * Math.PI) / 180;
    const phi_2 = (lat2 * Math.PI) / 180;

    const delta_phi = ((lat2 - lat1) * Math.PI) / 180;
    const delta_lambda = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(delta_phi / 2) * Math.sin(delta_phi / 2) +
      Math.cos(phi_1) *
        Math.cos(phi_2) *
        Math.sin(delta_lambda / 2) *
        Math.sin(delta_lambda / 2);

    const c = 2 * Math.atan(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  const handleCheckZone = () => {
    if (myLocation.lat === "" || myLocation.lng === "") {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error!",
        text: "Please enter your valid location.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    if (deliveryZone.lat === "" || deliveryZone.lng === "") {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error!",
        text: "Please enter delivery location.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    const distance = calculateDistance(
      myLocation.lat,
      deliveryZone.lat,
      myLocation.lng,
      deliveryZone.lng
    );
    if (distance <= deliveryZone.radius) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Success!",
        text: "You are in the delivery zone.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error!",
        text: "You aren't in the delivery zone.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
  };

  const handleStoreClick = (store) => {
    setDeliveryZone({ lat: store.lat, lng: store.lng, radius: store.radius });
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
        <button onClick={handleCheckZone} className="btn btn-outline">
          Check delivery zone
        </button>
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
          {/* Store & My Location Components */}
          <StoreLocation stores={stores} handleStoreClick={handleStoreClick} />
          <LocationMap setMyLocation={setMyLocation} myLocation={myLocation} />
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
