import war from '../assets/holograms/war-strikes.darb?url';
import cocolani from '../assets/holograms/cocolani-3d.darb?url';
import artillery from '../assets/holograms/artillery3d.darb?url';
import polyblast from '../assets/holograms/polyblast-arena.darb?url';
import warPoster from '../assets/holograms/war-strikes.png?url';
import cocolaniPoster from '../assets/holograms/cocolani-3d.png?url';
import artilleryPoster from '../assets/holograms/artillery3d.png?url';
import polyblastPoster from '../assets/holograms/polyblast-arena.png?url';
export const holograms:Record<string,{film:string;poster:string}>={
  'war-strikes':{film:war,poster:warPoster},'cocolani-3d':{film:cocolani,poster:cocolaniPoster},
  artillery3d:{film:artillery,poster:artilleryPoster},'polyblast-arena':{film:polyblast,poster:polyblastPoster},
};
