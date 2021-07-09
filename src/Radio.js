import React, { useEffect, useState } from "react";
import { RadioBrowserApi } from "radio-browser-api";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import defaultImage from "./radio.png";
import power from "./power-off-solid.svg";
import back from "./chevron-left-solid.svg";
import minus from "./minus-circle-solid.svg";
import plus from "./plus-circle-solid.svg";

export default () => {
  const [playMode, setPlayMode] = useState(false);
  const [station, setStation] = useState();
  const [stations, setStations] = useState();
  const [currentStation, setCurrentStation] = useState(1);

  useEffect(() => {
    setupApi().then((data) => {
      setStations(data);
    });
  }, []);

  const setupApi = async () => {
    const api = new RadioBrowserApi(fetch.bind(window), "My Radio App");

    const stations = await api.searchStations({
      language: "english",
      limit: 6,
    });

    setStation(stations[currentStation]);
    return stations;
  };

  const powerButton = () => {
    if (playMode === true) {
      setPlayMode(false);
    } else if (playMode === false) {
      setPlayMode(true);
    }
  };

  const nextStation = async () => {
    if (currentStation < 5) {
      setCurrentStation(currentStation + 1);
    }
    await setupApi();
  };

  const prevStation = async () => {
    if (currentStation > 0) {
      setCurrentStation(currentStation - 1);
      await setupApi();
    }
  };

  const status = (e) => {
    console.log(e);
  };

  const setDefaultSrc = (event) => {
    event.target.src = defaultImage;
  };

  return (
    <div className="container mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 roof position-relative">
            <p>STATIONS</p>
            <div className="position-absolute top-50 start-100 translate-middle">
              <img src={power} className="powerLogo" onClick={powerButton} />
            </div>
            <div className="position-absolute top-50 start-0 translate-middle ">
              <img
                src={back}
                className="backLogo"
                onClick={() => setPlayMode(false)}
              />
            </div>
            <div className="content rounded-bottom mt-3">
              <div className="mt-3">
                {playMode ? (
                  <div>
                    {station && (
                      <div className="station my-4">
                        <img
                          src={minus}
                          className="minusLogo"
                          onClick={prevStation}
                        />
                        <div className="stationName mb-4">
                          <img
                            className="logo"
                            src={station.favicon}
                            alt="station logo"
                            onError={setDefaultSrc}
                          />
                          <div className="name mt-2">{station.name}</div>
                        </div>
                        <img
                          src={plus}
                          className="plusLogo"
                          onClick={nextStation}
                        />

                        <AudioPlayer
                          className="player"
                          src={station.urlResolved}
                          showJumpControls={false}
                          layout="stacked"
                          customProgressBarSection={[]}
                          customControlsSection={[
                            "MAIN_CONTROLS",
                            "VOLUME_CONTROLS",
                          ]}
                          autoPlay={true}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {stations &&
                      stations.map((result) => {
                        return (
                          <div className="station">
                            <div className="stationName">
                              <div
                                className="name"
                                onClick={() => setPlayMode(true)}
                              >
                                {result.name}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="floor position relative">
            <div className="position-absolute top-100 start-50 translate-middle mt-4">
              ~Listening Radio~
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
