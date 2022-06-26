exports.neat = function(yourName) {
    let firstChar = yourName.slice(0,1);
firstChar = firstChar.toUpperCase();
let restChar = yourName.slice(1,yourName.length);
restChar = restChar.toLowerCase();
const newName = firstChar + restChar;

  
  
    return newName;
  };

exports.smooth = function(yourEmail) {
    let jEmail = yourEmail.length - 6;

    let justEmail = yourEmail.slice(0,jEmail);

  
    return justEmail;
  };

exports.smoothEnd = function(yourEmail) {
    let jEmail = yourEmail.length - 6;

    let justEmail = yourEmail.slice(jEmail,yourEmail.length);

  
    return justEmail;
  };

// exports.funds = function (fund) {
//     let bal = '';
//  if ( fund.length <= 3 ){ return bal = `${fund}.00`}
//    else if( fund.length === 4 ) {
//    const sliceA = fund.slice(0, 1); 
//    const sOR = fund.slice(1, fund.length); 
//    return bal = `${sliceA},${sOR}.00`;
//    } else if ( fund.length === 5 ){
//     const sliceB = fund.slice(1, 2); 
//     const sOS = fund.slice(2, fund.length); 
//     return bal = `${sliceB},${sOS}.00`;
//     } 
//     else if ( fund.length === 6 ){
//     const sliceC = fund.slice(2, 3); 
//     const sOT = fund.slice(3, fund.length); 
//     return bal = `${sliceC},${sOT}.00`;
//     } 
//     else if ( fund.length === 7 ){
//       const sliceCA = fund.slice(0, 1); 
//     const sliceC = fund.slice(1, 4); 
//     const sOU = fund.slice(4, fund.length); 
//     return bal = `${sliceCA},${sliceC},${sOU}`;
//     } else if ( fund.length === 8 ){
//       const sliceDA = fund.slice(1, 2); 
//       const sliceD = fund.slice(2, 5); 
//       const sOV = fund.slice(5, fund.length); 
//       return bal = `${sliceDA},${sliceD},${sOV}.00`;
//     }
//      else if ( fund.length === 9 ){
//       const sliceEA = fund.slice(2, 3); 
//       const sliceE = fund.slice(3, 6); 
//       const sOW = fund.slice(6, fund.length); 
//       return bal = `${sliceEA},${sliceE},${sOW}.00`;
//     }
//      else if ( fund.length === 10 ){
//       const sliceFA = fund.slice(0, 1); 
//       const sliceFB = fund.slice(1, 4); 
//       const sliceF = fund.slice(4, 7); 
//       const sOX = fund.slice(7, fund.length); 
//       return bal = `${sliceFA},${sliceFB},${sliceF},${sOX}.00`;
//     }
//      else{
//       const sliceGA = fund.slice(1, 2); 
//       const sliceGB = fund.slice(2, 5); 
//       const sliceG = fund.slice(5, 8); 
//       const sOY = fund.slice(8, fund.length); 
//       return  bal = `${sliceGA},${sliceGB},${sliceG},${sOY}.00`;
//     }
    
// }