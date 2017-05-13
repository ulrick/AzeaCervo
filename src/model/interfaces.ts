import { Announcement } from "../pages/announcement/announcement";

export interface IDistrict {
    id : number,
    name : string
}

export interface IAnnouncement {

    /*id : number;
    category : string;
    type : string;
    title : string;
    message : string;
    price : number;
    date : string;
    photo : string;*/

    onSelect(event: any, announcement: Announcement):void;
}
