
//=============================================================================
// STR_ReJoinParty.js  2016/07/30
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc テスト用プラグイン
 * @author Toshio Yamashita (yamachan)
 *
 * @help このプラグインにはプラグインコマンドはありません。
 * テスト用に作成したものなので、実際に利用する場合には適当にリネームしてください
 */

(function(_global) {

    Game_Party.prototype.addActor = function(actorId) {
        var data = $gameSystem.waitingMembers();
        if(data.indexOf(actorId) == -1){  //KanjiPartyChanges.jsの控えの中に存在しない場合のみパーティに加える処理
            if (!this._actors.contains(actorId)) { //パーティにも存在しない場合はパーティに加える
                this._actors.push(actorId);
                $gamePlayer.refresh();
                $gameMap.requestRefresh();
            } else{  //パーティに存在する場合はポイント加算処理
                Game_Enemy.prototype.getPointActor(actorId);
            }
        }else{  //控えに存在する場合はポイント加算処理
            Game_Enemy.prototype.getPointActor(actorId);
        }
    };

    Game_Enemy.prototype.getPointActor = function(actorId) {//ポイント加算処理
        var checkPoint = $dataActors[actorId].meta.s;
        $gameSelfVariables.actor(actorId).setValue(1, 1, '+')
        var ac_name = $dataActors[actorId].name;
        var point = String($gameSelfVariables.actor(actorId).value(1));
        $gameMessage.add(ac_name + "は動きを見て学んだ。\n" + "所持ポイント：" + point + "P")

        if(checkPoint !== undefined){
            checkPoint.forEach(function(cp, index){
                cp = cp.split(",");
                if(point >= Number(cp[0])){
                    if(!$gameActors.actor(actorId).isLearnedSkill(Number(cp[1]))){
                        $gameActors.actor(actorId).learnSkill(Number(cp[1]))
                        $gameMessage.add(ac_name + "は  " + $dataSkills[Number(cp[1])].description + "\nを習得した。")
                    }
                }
            })
        }
    }
    // ここにプラグイン処理を記載
    Game_Party.prototype.maxItems = function(item) {
        return 9999;
    };
        
})(this);