import { Announcement } from "../pages/announcement/announcement";
import { User } from "../pages/user/user";
import { Location } from "../pages/location/location";

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

export interface IAnnouncementService {

    create(announcement : Announcement) : Promise<Announcement>;
    read() : Promise<any>;
    update(announcement : Announcement) : Promise<Announcement>;
    delete(announcement : Announcement) : Promise<Announcement>;
}

export interface IUserService {

    create(user : User) : Promise<any>;
    read() : Promise<User[]>;
    update(user : User) : Promise<User>;
    delete(user : User) : Promise<User>;
}


export interface ILocationService {

    create(location : Location) : Promise<any>;
    read() : Promise<Location[]>;
    update(location : Location) : Promise<Location>;
    delete(location : Location) : Promise<Location>;
}


/**
 *  Home page interface
 * 
 * @export
 * @interface IHomePage
 */
export interface IHomePage {

    /**
     * Show the list of announcements
     * 
     * @param {*} param 
     * 
     * @memberof IHomePage
     */
    showAnnouncementDetail(param : any) : void;


    /**
     * Allow navigation to the AddAnnouncement page for creating a new announcement
     * 
     * 
     * @memberof IHomePage
     */
    addAnnouncement(): void;

} 
