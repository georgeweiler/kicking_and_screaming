let globalPlayers = [];

let globalPositions = [
  "pitcher",
  "catcher",
  "first base",
  "second base",
  "thurd base",
  "short stop",
  "left center",
  "right center",
  "left outfield",
  "center outfield",
  "right outfield"
];
let globalBattingLineup = [];
let globalCurrentlyAtBat;
let globalPlayersWithoutSubs;
function addPlayer(){
  let playerObj = {
    name: $('#add-player-input').val()
  }
  
  if(_.find(globalPlayers, (player)=> player.name === playerObj.name)){
    alert("names must be unique. choose a nickname")
  } else{
    
    // 11 people already assigned -- START ASSIGNING SUBS
    if(globalPositions.length === 0){
      //LMAO GOOD LUCK UNDERSTANDING THIS SHIT
      globalPlayersWithoutSubs = _.filter(globalPlayers, player => !player.hasSub).map(player => player.name);
      playerIdx = Math.floor(Math.random()*globalPlayersWithoutSubs.length);
      playerObj.position = `Sub for: ${globalPlayersWithoutSubs[playerIdx]}`;
      playerObj.hasSub = true;
      let sub = _.findWhere(globalPlayers, {name: globalPlayersWithoutSubs[playerIdx]});
      if(!sub){
        alert('jesus christ kick just some people off the team')
        return;
      }
      playerObj.sub = sub.name;
      sub.hasSub = true;
      sub.sub = playerObj.name;
      globalPlayersWithoutSubs = _.without(globalPlayersWithoutSubs, globalPlayersWithoutSubs[playerIdx]);
    } else {
      let posIdx = Math.floor(Math.random()*globalPositions.length);
          playerObj.position = globalPositions[posIdx];
          globalPositions = _.without(globalPositions, playerObj.position);
    }

    playerObj.isStarter = globalPositions.length > 0;
    globalPlayers.push(playerObj);
    
    $('#player-list').prepend(`
        <tr>
          <td class='player-td'>${playerObj.name}</td>
          <td class='position-td'>${playerObj.position}</td>
        </tr>
    `);
  //`<td><a id='foo' class="btn-floating btn-xsmall waves-effect waves-light red" onclick='removePlayer(this)'><i class="material-icons">thumb_down</i></a></td>`        
  }
 $('#add-player-input').val("");
}

function createBattingLineup(){
  if(globalPlayers.length < 11){
    alert('you need more players');
    return;
  }
  let shuffledPlayers = _.shuffle(globalPlayers);
  let alreadyAdded = [];
  while(shuffledPlayers.length){
    let randomPlayer = shuffledPlayers.pop();
    if(!randomPlayer.hasSub){
      globalBattingLineup.push([randomPlayer.name])
    } 
    else {
      if(!_.contains(alreadyAdded, randomPlayer.name) || !_.contains(alreadyAdded, randomPlayer.sub)){
        alreadyAdded.push(randomPlayer.name)
        alreadyAdded.push(randomPlayer.sub)
        globalBattingLineup.push([randomPlayer.name, randomPlayer.sub])
      }
    }
  }
  rotateBattingLineup()
  $('#start-game-btn').hide();
}
createBattingLineup = _.once(createBattingLineup);

function rotateBattingLineup(){
  globalCurrentlyAtBat = globalBattingLineup.shift();
  $('#up-to-bat').html(`<li class='list-group-item'>${globalCurrentlyAtBat[0]}</li>`);
  if(globalCurrentlyAtBat.length === 1){
    globalBattingLineup.push(globalCurrentlyAtBat);
  } else {
    let temp = [
      globalCurrentlyAtBat[1],
      globalCurrentlyAtBat[0]
    ];
    globalBattingLineup.push(temp);
  }
  let html = '';
  for(var i = 0; i<3; i++){
    html += `<li class='list-group-item'>${globalBattingLineup[i][0]}</li>`;
  }
  $('#batting-lineup').html(html)
}
function nextAtBat(){
  rotateBattingLineup()
}