import React, {useContext} from "react";
import { AppGlobalData } from '../App';


const UserDetailsComponent: React.FC = () => {
    const { personalDetails } = useContext(AppGlobalData);
    console.log("EliyaYOOO",personalDetails)
  return (
    <div>
        <h2>User Details</h2>
        <div>
            <img src={personalDetails?.avatar} alt="User Avatar" style={{borderRadius:'50%'}}/>
        </div>
        <div>
            <strong>Name:</strong> {personalDetails?.name}
        </div>
        <div>
            <strong>Team:</strong> {personalDetails?.Team}
        </div>
        <div>
            <strong>Joined At:</strong> {personalDetails?.joinedAt}
        </div>    
    </div>
  );
};

export default UserDetailsComponent;
