import { useState, useEffect } from "react";
import axios from "axios";
import "~style.css";
import dotenv from "dotenv";
dotenv.config();
import { GetNation } from "~components/Nation";
import { classes } from "~components/classes";
const { parentDivClasses, div2Classes, dataDivClasses, h2Classes, dataParentDivClasses, buttonClasses } = classes
interface IpData {
  ip: string;
}
interface Location {
  city: string;
  country: string;
}


function IndexPopup() {
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState<Location | null>(null);
  const [ipData, setIpData] = useState<IpData | null>(null);
  const [buttonText, setButtonText] = useState("Show my location");

  const IP_URL = "https://api.ipify.org?format=json";
  useEffect(() => {
    if (ipData) {
      const token: string | undefined =
        process.env.PLASMO_PUBLIC_LOCATION_TOKEN;
      const Detail_URL = `https://ipinfo.io/${ipData.ip}?token=${token}`;
      axios
        .get<Location>(Detail_URL)
        .then((res2) => {
          res2.data.country = GetNation(res2.data.country);
          setLocationData(res2.data);
          setButtonText("Show my location");
        })
        .catch((error) => {
          console.error("Error fetching location data:", error);
        });
    }
  }, [ipData]);

  const buttonHandler = async () => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 3000);
      });

      const response = await axios.get<IpData>(IP_URL);
      setIpData(response.data);
      setButtonText("Loading...");
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className={parentDivClasses}>
      <div className={div2Classes}>
        <div className={dataParentDivClasses}>
          {locationData && (
            <div className={dataDivClasses}>
              <h2 className={h2Classes}>
                Your country is {locationData.country}
              </h2>
              <h2 className={h2Classes}>
                and city is {locationData.city}
              </h2>
            </div>
          )}
        </div>
        <button
          type="button"
          className={buttonClasses}
          onClick={buttonHandler}
          name="btn1"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : buttonText}
        </button>
      </div>
    </div>
  );
}

export default IndexPopup;
