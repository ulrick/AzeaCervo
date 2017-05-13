import { Component, ViewChild } from '@angular/core';
import { NavController, Nav, Tabs, NavParams } from 'ionic-angular';
import { Http }                         from '@angular/http';
import 'rxjs/add/operator/map';

import { Offers }                       from '../offers/offers-page';
import { TypeAnnouncements, CategoriesAnnouncements,  JobSubCategories}   from '../../model/commonEnum';
import { IDistrict, IAnnouncement }   from '../../model/interfaces';
import { DISTRICT, ADS } from '../../model/consts';
import { Announcement } from './announcement';


@Component({
  selector: 'announcement',
  templateUrl: 'announcement.html'
})
export class AnnouncementComponent implements IAnnouncement {

    id: number;
    category: string;
    type: string;
    message: string;
    price: number;
    date: string;
    photo: string;

    districts : IDistrict[] = DISTRICT;

    title = "les annonces";
    announcements = ADS;
    selectedAnnouncement: Announcement;
    selectedDistrict : any;


    public items : any = [];
    private typeAnnouncement = TypeAnnouncements.offers;
    public navOptions: { id: number; district: string; typeAnnouncement: string; };
    

    constructor(public navCtrl: NavController, public navParams: NavParams, public http : Http) {
        //console.log("Passed params", navParams.data);
    }

    onSelect(event: any, announcement: Announcement): void {
    }

    public onDistrictSelect(event, district) : void{
        this.selectedDistrict = district;
        this.goToAnnouncement(district);
    }

    private goToAnnouncement(district : IDistrict): void{
        this.navOptions = {
            id : district.id,
            district : district.name,
            typeAnnouncement : TypeAnnouncements[this.typeAnnouncement]
        }
        this.navCtrl.push(Offers, this.navOptions);
        //this.navCtrl.setRoot(Offers);

        //this.navCtrl.parent.select(this.typeAnnouncement);
    
    }

    public getTypeAnnouncement(): number{
        return this.typeAnnouncement;
    }

    public setTypeAnnouncement(typeAnnouncement: number): void{
        this.typeAnnouncement = typeAnnouncement;
    }

    ionViewWillEnter(){
        this.load();
    }


    // Retrieve the JSON encoded data from the remote server
    // Using Angular's Http class and an Observable - then
    // assign this to the  array for rendering to the HTML template
    load(){
        this.http.get('http://www.manasse-yawo.com/azea-cervo/retrieve-data.php')
        .map(res => res.json())
        .subscribe(data =>
        {
            this.items = data;
        });
    }

    // For modification of item
    public viewEntry(param){
        this.navCtrl.push('AddAnnouncement', param);
    }

    public getSubCategoriesAnnouncements( categoriesAnnouncements : CategoriesAnnouncements) : string[]{
        let subCategoriesAnnouncements : string[];

        switch (categoriesAnnouncements){

            case CategoriesAnnouncements.Jobs : 
                subCategoriesAnnouncements = ["Offre d'emploi"];
                break;

            case CategoriesAnnouncements.Vehicles : 
                subCategoriesAnnouncements = ["Voitures", "Motos", "Caravaning", "Nautisme", "Utilitaires", "Equipement auto", "Equipement moto", "Equipement caravaning", "Equipement nautisme"];
                break;

            case CategoriesAnnouncements.Properties : 
                subCategoriesAnnouncements = ["Ventes immobilières", "Locations", "Colocations", "Bureaux & Commerces"];
                break;

            case CategoriesAnnouncements.Holidays : 
                subCategoriesAnnouncements = ["Locations & Gites", "Chambres d'hôtes", "Hôtels", "Campings", "Hebergements insolites"];
                break;

            case CategoriesAnnouncements.Multimedia : 
                subCategoriesAnnouncements = ["Informatiques", "Consoles & Jeux videos", "Images & Sons", "Téléphonie"];
                break;

            case CategoriesAnnouncements.Home : 
                subCategoriesAnnouncements = ["Ammeublements", "Electroménager", "Art de la tables", "Décorations", "Linges de maison", "Jardinages", "Bricolages", "Vêtements", "Chaussures", "Accessoires & Bagageries", "Montres & Bijoux", "Equipements bébé", "Vêtements bébé"];
                break;

            case CategoriesAnnouncements.Hobbies : 
                subCategoriesAnnouncements = ["DVD/Films", "CD/Musiques", "Livres", "Animaux", "Vélos", "Sports & Hobbies", "Instruments de musiques", "Collections", "Jeux et jouets", "Vins & Gastronomies"];
                break;

            case CategoriesAnnouncements.MaterialsPro : 
                subCategoriesAnnouncements = ["Materiel agricole", "Transport - Manutention ", "BTP - Chantier Gros-oeuvre", "Outillages - Matériaux 2nd oeuvres", "Equipements industriels", "Restauration-Hotelleries", "Fournitures de bureaux", "Commerces & marchés", "Materiel médical"];
                break;

            case CategoriesAnnouncements.Services : 
                subCategoriesAnnouncements = ["Prestations de services", "Billeteries", "Evênements", "Cours particuliers", "Covoiturage"];
                break;

            case CategoriesAnnouncements.Others : 
                subCategoriesAnnouncements = ["Autres"];
                break;
            
        }

        return subCategoriesAnnouncements;
    }




}