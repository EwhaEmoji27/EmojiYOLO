import React, {
  useRef,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import ImageContext from "../ImageContext/ImageContext";
import { Link } from "react-router-dom";
import usericon from "./img/user_icon.png";
import setupicon from "./img/setup.png";
import "./HomePage.css";
import Top from "./Top";

const HomePage = () => {
  /*const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const resultImageRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [frameCount, setFrameCount] = useState(0);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    return () => stopCapture();
  }, []);

  const set_streaming = () => {
    const formData = new FormData();
    formData.append("user_id", "1"); // 예시로 '1'을 사용했습니다. 필요에 따라 변경해야 할 수 있습니다.
    formData.append("stream_key", "your_stream_key"); // 스트림 키를 적절하게 설정해야 합니다.

    fetch("http://127.0.0.1:5000/set_streaming", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json()) // 응답 형식에 따라 적절히 조정하세요.
      .then((data) => {
        console.log("Streaming settings updated:", data);
      })
      .catch((error) => {
        console.error("Error setting streaming:", error);
      });
  };

  const start_streaming = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
        setCapturing(true);
        console.log("Streaming started");
      })
      .catch((error) => {
        console.error("Failed to start streaming:", error);
      });
  };
  const handleProcessButtonClick = () => {
    console.log("Process button clicked");
    // 여기에 필요한 로직을 추가하세요.
  };

  const add_face = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
          resultImageRef.current.style.display = "block";
          captureFrameLoop_add();
        }
      })
      .catch((error) => console.error("카메라 접근 에러:", error));
  };

  const captureFrameLoop_add = () => {
    if (!streamActive || frameCount > 50) {
      stopCapture();
      return;
    }
    const context = canvasRef.current.getContext("2d");
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    canvasRef.current.toBlob((blob) => {
      sendFrame_add(blob);
      setFrameCount(frameCount + 1);
    }, "image/jpeg");
    setTimeout(captureFrameLoop_add, 100);
  };

  const stopCapture = () => {
    if (streamActive) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      setStreamActive(false);
      setCapturing(false);
      videoRef.current.srcObject = null;
      console.log("Streaming and capturing stopped.");
    }
  };

  const sendFrame_add = (blob) => {
    const formData = new FormData();
    formData.append("user_id", 1);
    formData.append("frame", blob, "frame.jpg");
    fetch("http://127.0.0.1:5000/add_face", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        resultImageRef.current.src = URL.createObjectURL(blob);
      })
      .catch((error) => console.error("Error sending frame:", error));
  };

  const process_face = () => {
    if (!streamActive) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
          setCapturing(true);
          resultImageRef.current.style.display = "block";
          captureFrameLoop_process();
        })
        .catch((error) => console.error("Error processing face:", error));
    } else if (capturing) {
      stopCapture();
    }
  };

  const captureFrameLoop_process = () => {
    if (!streamActive || !capturing) {
      return;
    }
    const context = canvasRef.current.getContext("2d");
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    canvasRef.current.toBlob((blob) => {
      sendFrame_process(blob);
    }, "image/jpeg");
    setTimeout(captureFrameLoop_process, 100);
  };

  const sendFrame_process = (blob) => {
    const formData = new FormData();
    formData.append("user_id", "1");
    formData.append("selected_user_ids[]", "1");
    formData.append("frame", blob, "frame.jpg");
    fetch("http://127.0.0.1:5000/process_face", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        resultImageRef.current.src = URL.createObjectURL(blob);
      })
      .catch((error) => console.error("Error sending processed frame:", error));
  };*/
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { resultImageUrl, setResultImageUrl } = useContext(ImageContext);
  const [streamActive, setStreamActive] = useState(false);
  const [resultImageVisible, setResultImageVisible] = useState(false);
  const intervalRef = useRef(null);
  const [buttonTxt, setbuttonTxt] = useState("미리보기");
  const [buttonNum, setbuttonNum] = useState(0);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } catch (err) {
        console.error("카메라에 연결할 수 없습니다:", err);
        setStreamActive(false);
      }
    };

    getUserMedia();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        setStreamActive(false);
      }
    };
  }, []);

  useEffect(() => {
    if (streamActive) {
      intervalRef.current = setInterval(captureAndSendFrame, 100);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [streamActive]);

  useEffect(() => {
    console.log(buttonNum);
  }, [buttonNum]);

  const handlePreviewClick = useCallback(() => {
    if (!streamActive) return;
    setResultImageVisible(true);
    captureAndSendFrame();

    if (buttonNum === 0) {
      setbuttonTxt("시작하기");
      setbuttonNum(1);
    } else if (buttonNum === 1) {
      start_streaming();
      setbuttonTxt("멈추기");
      setbuttonNum(2);
    } else if (buttonNum === 2) {
      setbuttonTxt("미리보기");
      setbuttonNum(0);
      stopCapture();
    }
  }, [streamActive, buttonNum]);
  const stopCapture = () => {
    if (streamActive) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      setStreamActive(false);
      setCapturing(false);
      videoRef.current.srcObject = null;
      console.log("Streaming and capturing stopped.");
    }
  };

  const captureAndSendFrame = () => {
    if (!canvasRef.current || !videoRef.current) {
      console.error("Canvas or video element is not ready.");
      return;
    }
    const context = canvasRef.current.getContext("2d");
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    canvasRef.current.toBlob(sendFrameAdd, "image/jpeg");
  };

  const sendFrameAdd = (blob) => {
    let formData = new FormData();
    formData.append("user_id", 1);
    formData.append("selected_user_ids[]", 1);
    formData.append("frame", blob, "frame.jpg");

    fetch("http://127.0.0.1:5000/process_face", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        const objectURL = URL.createObjectURL(blob);
        setResultImageUrl(objectURL);
      })
      .catch((error) => console.error("Error:", error));
  };

  const set_streaming = (blob) => {
    let formData = new FormData();
    formData.append("user_id", "1");
    formData.append("stream_key", "");
    fetch("http://110.9.11.9:5000/set_streaming", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        //resultImage.src = URL.createObjectURL(blob); // 처리된 이미지 업데이트
      })
      .catch((error) => console.error("Error:", error));
  };
  const start_streaming = () => {
    if (!streamActive) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.srcObject = stream;
          streamActive = true;
          capturing = true;
          captureFrameLoop_streaming();
          resultImageUrl.style.display = "block"; // 처리 후 영상 보여주기
        })
        .catch((error) => console.error(error));
    } else if (capturing) {
      stopCapture(); // 캡처 중지
      let formData = new FormData();
      formData.append("user_id", "1");
      fetch("http://110.9.11.9:5000/stop_streaming", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          console.log("Streaming stopped");
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  function captureFrameLoop_streaming() {
    if (!streamActive || !capturing) {
      return;
    }
    const context = canvasRef.current.getContext("2d");

    context.drawImage(videoRef, 0, 0, canvasRef.width, canvasRef.height);
    canvasRef.toBlob((blob) => {
      sendFrame_streaming(blob);
    }, "image/jpeg");
    setTimeout(captureFrameLoop_streaming, 100); // 0.1초 간격으로 프레임 캡처
  }

  function sendFrame_streaming(blob) {
    let formData = new FormData();
    formData.append("user_id", "1");
    formData.append("selected_user_ids[]", 1);
    formData.append("frame", blob, ["frame.jpg"]);
    fetch("http://110.9.11.9:5000/start_streaming", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        resultImageUrl.src = URL.createObjectURL(blob); // 처리된 이미지 업데이트
      })
      .catch((error) => console.error("Error:", error));
  }

  // 페이지 로드 시 실행되는 함수
  window.onload = function () {
    // 쿠키에서 사용자 ID를 가져와서 id_text 엘리먼트에 적용
    const userID = getCookie("userID");
    document.getElementById("userID").innerText = userID;
  };

  // 쿠키에서 특정 이름의 쿠키 값을 가져오는 함수
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  return (
    <div className="Home-all">
      <div className="Topbox">
        <Top />
      </div>
      <div className="Home-contents">
        <div className="videobox">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "640px", height: "480px", display: "none" }}
          />
          <canvas
            ref={canvasRef}
            style={{ display: "none" }}
            width="640"
            height="480"
          ></canvas>
          {resultImageUrl && resultImageVisible && (
            <img src={resultImageUrl} alt="Processed Image" />
          )}
        </div>
        <div className="userbox">
          <div className="UserInfo_top">
            <div className="emptybox"></div>
            <div className="usericon_box">
              <div className="usericon">
                <img
                  className="user_icon"
                  src={usericon}
                  alt="User Icon"
                  style={{ width: "7vh", height: "auto" }}
                />
              </div>
            </div>
            <div className="gosetup">
              <p id="al">
                <Link to="/setup" className="gosetup">
                  <img src={setupicon} alt="setupicon" />
                </Link>
              </p>
            </div>
          </div>
          <div className="users-box">
            <div className="userid">id </div>
            <div className="RegisteredUser">
              &nbsp;&nbsp;등록된 사용자&nbsp;&nbsp;
            </div>
            <button className="userplus">
              <Link to="/adduser" className="adduser">
                <div className="plusbutton">+</div>
              </Link>
            </button>
          </div>

          <button
            onClick={handlePreviewClick}
            className="startProcessButton "
            style={{
              height: "7%",
              width: "100%",
              fontSize: "22px",
              border: "none",
              fontFamily: '"Do Hyeon", sans-serif',
              color: "#8f8e8e",
            }}
          >
            {buttonTxt}
          </button>
        </div>
      </div>
    </div>
  );
};
export default HomePage;

// 0503 이전 코드
/*import React, { useState } from "react";
//import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Top from "./Top";
import UserInfoPanel from "./UserInfoPanel";
import ContentArea from "./ContentArea";

import "./App.css";

function HomePage() {
  return (
    <div className="App">
      <div className="Top">
        <Top />
      </div>

      <div className="ContentWrapper">
        <ContentArea />

        <UserInfoPanel />
      </div>
    </div>
  );
}

export default HomePage;*/

/*function App(){
  return(
    <Router>
      

        <div className="App">

          <div className='Top'>
            <Top />
            
          </div>
        <Routes>
          <Route path='/' component={HomePage} />
          <Route path='/setup' element={<Setup/>}/>

        </Routes>

          <div className="ContentWrapper">

            <ContentArea />

            <UserInfoPanel />

          </div>
        </div>
      </Router>
  )

}*/
