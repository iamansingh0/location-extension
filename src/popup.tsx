import { useState, useEffect } from "react"
import axios from 'axios'
import "~style.css"
import dotenv from "dotenv";
dotenv.config({ path: "src/config/config.env" });

interface IpData {
  ip: string;
}
interface Location {
  city: string,
  country: string;
}

function GetNation(nation_code: string) {
  const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
  const nat =  regionNames.of(nation_code)
  return nat;
}

function IndexPopup() {
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState<Location | null>(null);
  const [ipData, setIpData] = useState<IpData | null>(null);
  const [buttonText, setButtonText] = useState("Show my location");

  const IP_URL = 'https://api.ipify.org?format=json'
  useEffect(() => {
    if (ipData) {
      const Detail_URL = `https://ipinfo.io/${ipData.ip}?token=110b93d9eb46c2`;
      axios.get<Location>(Detail_URL).then((res2) => {
        res2.data.country = GetNation(res2.data.country);
        setLocationData(res2.data);
        setButtonText("Show my location");
      }).catch((error) => {
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
    <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-h-[500px] plasmo-w-[500px] plasmo-bg-[#2293B0] plasmo-flex-col">
      <div className="plasmo-absolute plasmo-top-28">
        {locationData && (
          <div>
            <h2 className="plasmo-text-base plasmo-text-slate-50">Your country is {locationData.country}</h2>
            <h2 className="plasmo-text-base plasmo-text-slate-50">and city is {locationData.city}</h2>
            {/* <h2>{getToken}</h2> */}
          </div>
        )}
      </div>
      <button
        type="button"
        className="plasmo-flex plasmo-flex-row plasmo-items-center plasmo-justify-center plasmo-px-4 plasmo-py-2 plasmo-text-base plasmo-transition-all plasmo-border-none
      plasmo-shadow-lg hover:plasmo-shadow-md plasmo-font-bold
      active:plasmo-scale-105 plasmo-bg-slate-50 hover:plasmo-bg-slate-100 plasmo-text-slate-800 hover:plasmo-text-slate-900 plasmo-w-[200px] plasmo-h-[50px]"
      onClick={buttonHandler} name="btn1" disabled={isLoading}>
        {isLoading ? "Loading..." : buttonText}
      </button>
    </div>
  )
}

export default IndexPopup
