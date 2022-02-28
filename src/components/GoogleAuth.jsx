import React , {useEffect,useState} from "react";
import { loadAuth2, gapi } from 'gapi-script';
import { connect } from 'react-redux';
import { signIn, signOut } from './../service/action';
import Button from '@mui/material/Button';

function GoogleAuth(props) {

    var auth2 = null;
    const [Auth,setAuth] = useState("");

    const initAuth = async () => {
        auth2 = await loadAuth2(gapi, '384875649458-3mu6rmaenhtmadf937p6i1f020j3i9uk.apps.googleusercontent.com', "email")
        setAuth(auth2);
        onAuthChange(auth2.isSignedIn.get());
        auth2.isSignedIn.listen(onAuthChange)
        };

    useEffect(() => {
        try{
            initAuth();
        }catch(e){
            console.warn(e.message);
        }// eslint-disable-next-line
    }, []);

    const onAuthChange = (isSignedIn) => {
        if (isSignedIn) {
            let getProfile = auth2.currentUser.get().getBasicProfile();
            let uid = getProfile.getId();
            let name = getProfile.getName();
            let email = getProfile.getEmail();
            let img = getProfile.getImageUrl();
            let payload = {"userId": uid ,"userName": name ,"userEmail": email ,"userImg": img};
            props.signIn(payload);
        }
        else {
            props.signOut();
        }
    } 
    const onSignInClick = () => { Auth.signIn() }
    const onSignOutClick = () => { Auth.signOut() }
    
    return (props.isSignedIn?
    <Button color="error" variant="contained" onClick={onSignOutClick}>Sign Out</Button>
    :
    <Button color="success" variant="contained" onClick={onSignInClick}>Google Sign In</Button>
    )
}

const mapStateToProps = (state) => {
    return { isSignedIn: state.auth.isSignedIn }
}

export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);
