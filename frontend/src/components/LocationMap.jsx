import { useMapEvent, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import homeIcon from "../assets/home.png";

const LocationMap = ({ setMyLocation, myLocation }) => {
  const myLocationIcon = L.icon({
    iconUrl: homeIcon, // เปลี่ยนเป็น URL ของไอคอนที่คุณต้องการ
    iconSize: [37, 37], // ขนาดไอคอน
  });

  useMapEvent({
    click(e) {
      const { lat, lng } = e.latlng;
      setMyLocation({ lat, lng });
    },
  });
  return (
    <Marker icon={myLocationIcon} position={[myLocation.lat, myLocation.lng]}>
      <Popup>My current location</Popup>
    </Marker>
  );
};

export default LocationMap;
