
import { User } from "../user/user";
import { Location } from "../location/location";

export class Announcement {

    id : number;
    category : string;
    type : string;
    title : string;
    message : string;
    price : number;
    date : string;
    photo : string;
    imgThumb ? : string;
    user : User;
    location : Location;
}


/*id : number;
    category : string;
    type : string;
    title : string;
    message : string;
    price : number;
    date : string;
    photo : string;
    imgThumb ? : string;
    user : number;
    username : string;
    email : string;
    telephone : string;
    location : number;
    city : string;
    region : string;*/