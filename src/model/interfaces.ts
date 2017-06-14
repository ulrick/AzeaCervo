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

export interface IAnnouncementService {

    getAnnouncements() : void;
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
    showAnnouncements(param : any) : void;


    /**
     * Allow navigation to the AddAnnouncement page for creating a new announcement
     * 
     * 
     * @memberof IHomePage
     */
    addAnnouncement(): void;
} 
