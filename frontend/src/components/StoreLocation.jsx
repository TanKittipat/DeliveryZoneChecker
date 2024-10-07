import { Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import storeIcon from "../assets/store.png";

const StoreLocation = ({ stores, handleStoreClick }) => {
  const storeMapIcon = L.icon({
    iconUrl: storeIcon, // เปลี่ยนเป็น URL ของไอคอนที่คุณต้องการ
    iconSize: [37, 37], // ขนาดไอคอน
  });
  return (
    <>
      {" "}
      {stores &&
        stores.map((store) => {
          return (
            <Marker
              icon={storeMapIcon}
              eventHandlers={{
                click: () => {
                  handleStoreClick(store);
                },
              }}
              position={[store.lat, store.lng]}
            >
              <Popup>
                <b>{store.name}</b>
                <p>{store.address}</p>
                <p>{store.id}</p>
              </Popup>
            </Marker>
          );
        })}
    </>
  );
};

export default StoreLocation;
