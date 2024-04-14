import React from "react";
import Top from "../Home/Top";
import "./Setup_ChangeStreamKey.css";
import usericon from "../Home/img/user_icon.png";
import { Link } from "react-router-dom";
function Setup_ChangeStreamKey() {
  return (
    <div className="Setup_Page" style={{ height: "100%" }}>
      <div className="Top">
        <Top />
      </div>

      <div className="SetupPage_info">
        <div className="back">
          <div className="usericon_setup">
            <img className="user_icon_" src={usericon} alt="User Icon" />
          </div>
          <div>아이디</div>
          <div className="input_and_check">
            <div className="Change_Info_box">
              <div className="input_place_box">
                <input
                  type="text"
                  className="input_place"
                  placeholder="스트림키 입력"
                />
              </div>
            </div>
            <Link to="/home">
              <button className="GOHome">확인</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setup_ChangeStreamKey;
