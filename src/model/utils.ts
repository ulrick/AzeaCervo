import { TARGET_PHOTO_FOLDER } from "./consts";

export class Utils {

    /**
     * Render the absolute path according of the first announcement image.
     * @param img
     * @return {string} Image absolute path
     */
    public static buildPhotoPathThumb(img: string): string {

        let imgPath: string = null;
        if(img !== ""){

            if(img.indexOf(",") != -1){
                imgPath = TARGET_PHOTO_FOLDER + img.split(',')[0]; // We get only the first photo to display
            }
            else{
                imgPath = TARGET_PHOTO_FOLDER + img;
            }
        }
        /*else{
            imgPath = null;
        }*/

        return imgPath;
    }


    /**
     * Render the absolute path of each announcement image.
     * @param img
     * @return {string} Image absolute path
     */
    public static buildPhotosPath(img: string): string[] {
        return []
    }


     /**
     *  Converts current date to format YYYY-MM-DD hh:mm:ss to register into the database
     *  @return {string} Current datetime to register
     */
    public static getDateToRegister(): string{
        let dateNow = new Date().toISOString(); // Date is converted to the following format 2017-05-08T17:13:24.852Z format
        let parts = dateNow.split('.')[0].split('T').join(' ');
      
        return parts;
	}
}