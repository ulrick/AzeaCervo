import { IDistrict } from "./interfaces";
import { Announcement } from "../pages/announcement/announcement";
import { User } from "../user/user";

export const ADS: Announcement[] = [
    {
        id: 1,
        category: "Multimedia",
        type: "offers", 
        title: "Samsung S3 en tr\u00e8s bon \u00e9tat", 
        message: "Je vends une Samsung neuf avec sa boite d'origine. ", 
        price: 120, 
        photo: "",
        date: "2017-04-23 16:25:00",
        city : "Attiégou",
        user: {id : 1, username : "yawo", email : "ymanasse@gmail.com", telephone : "0760797742"},
        location: {id : 1, city : "Attiégou", region : ""}
    },
    {
        id: 2,
        category: "multimedia", 
        type: "offers", 
        title: "Samsung S3 en tr\u00e8s bon \u00e9tat", 
        message: "Je vends une Samsung neuf avec sa boite d'origine. ", 
        price: 100, 
        photo: "", 
        date: "2017-04-24 16:25:00",
        city : "Togo 2000",
        user: {id : 2, username : "kodjo", email : "ymanasse@gmail.com", telephone : "0760797742"},
        location: {id : 2, city : "Togo 2000", region : ""}
    }
];


export const DISTRICT: IDistrict[] = [
    {
        id: 1,
        name: "Savane"
    },
    {
        id: 2,
        name: "Kara"
    },
    {
        id: 3,
        name: "Centrale"
    },
    {
        id: 4,
        name: "Plateaux"
    },
    {
        id: 5,
        name: "Maritime"
    }
];

export const BASE_URI : string = "http://www.manasse-yawo.com/azea-cervo";


/**
 * Target the uploads photo folder : "http://www.manasse-yawo.com/azea-cervo/uploads/"
 */
export const TARGET_PHOTO_FOLDER : string = "http://www.manasse-yawo.com/azea-cervo/uploads/";


// Destination img URL
export const UPLOAD_IMG_URL : string  = "http://www.manasse-yawo.com/azea-cervo/upload.php";