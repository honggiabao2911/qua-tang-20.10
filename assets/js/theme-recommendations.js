/* Suggestions only: filtering never changes the recipient, words or music. */
(() => {
  'use strict';
  const labels=Object.freeze({mom:'Mẹ',grandma:'Bà',teacher:'Cô giáo',sister:'Chị / em gái',women:'Bạn nữ / nhóm phụ nữ',lover:'Người thương'});
  const groups=Object.freeze({
    mom:['motherhug','sunflower','glassgarden','rose','garden','teacup','sunmail','musicbox','umbrella','wishtree'],
    grandma:['grandmatea','lotus','lotusmoon','teacup','lavender','moonlake','pearl','wishtree','glassgarden','dandelion'],
    teacher:['teacherbloom','teachingbook','chalkconstellation','wishtree','classroom','letter','storybook','pearl','sunmail','starcrane','aurora','lavender','wisteria'],
    sister:['sisterswing','butterfly','balloon','island','garden','sunflower','dandelion','crystal','glassgarden'],
    women:['friendpicnic','garden','butterfly','sunflower','balloon','lantern','silk','glassgarden','lavender','aurora','seabottle'],
    lover:['lovewaltz','lovegalaxy','heartgarden','crystal','rose','wisteria','moonlake','galaxy','starcrane','seabottle','lightbridge','ocean','musicbox','silk']
  });
  const groupFor=target=>target==='friend'?'women':Object.hasOwn(groups,target)?target:'women';
  const idsFor=target=>groups[groupFor(target)].filter(id=>Object.hasOwn(CardThemes.catalog,id));
  window.CardRecommendations=Object.freeze({labels,groupFor,idsFor});
})();
