//=============================================================================
// STR_EnemyStatsChange.js 2021/04/06
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc 戦闘中の敵のステータスを変更するプラグイン
 * @author satori
 * 
 * 
 * 
 * @help
 * 戦闘開始時に敵グループにて、以下のプラグインコマンドで敵の能力値を変更
 * 
 * 全体的に倍率でステータスを上昇させる場合
 * ChangeLevels [グループ内の敵番号] [倍率]
 * ※倍率は100分率で記載してください。
 * 
 * ステータスを直接変更する場合
 * ChangeStats [グループ内の敵番号] [hp] [mp] [att] [def] [mat] [mdf] [sp] [luk]
 * 
 * なお、グループ内の敵番号は0から始まるとする。
 * 同じ敵に複数回使用する事も可能。（複合も可）
 * 
 */

(function(_global) {
    "use strict";

    const pluginName = 'ChangeStats';

    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        if (command === pluginName) {
            EnemyStatsChange(args);
        }

        if (command === "ChangeLevels"){
            Changelevels(args)
        }
    };

    function EnemyStatsChange(args){             //プラグインコマンドに入力された数値分能力値をプラスする。
        args.forEach(function(ele, index){
            args[index] = Number(ele);
        });
        for(let i = 0;i < 8;i++){
            $gameTroop._enemies[args[0]]._paramPlus[i] += args[i + 1];
        }
        $gameTroop.members()[args[0]].recoverAll();
        var levels = EnemyLevel( $gameTroop._enemies[args[0]]._enemyId, $gameTroop._enemies[args[0]]._paramPlus );
        MakeLevels(args[0]);
        $gameTroop._enemies[args[0]]._level += levels;
    }

    function Changelevels(args){                 //引き上げたいレベルを受け取って、その分能力値をプラスする。
        args.forEach(function(ele, index){
            args[index] = Number(ele);
        });
        var enemyid = $gameTroop._enemies[args[0]]._enemyId;
        var enemy = $dataEnemies[enemyid];
        var upStats = [];
        upStats[0] = args[0];
        for(var i = 0; i < 8;i++){               //倍率を受け取り上昇させる能力値を決定
            upStats[i+1] = Math.round(enemy.params[i] * (args[1]/100));
        }
        EnemyStatsChange(upStats);
    }



    function EnemyLevel(id,plusStats){
        var enemy = $dataEnemies[id];
        var diffstats = 0;
        diffstats += (plusStats[0] / enemy.params[0]) * 4;
        for(var i = 0; i < 4;i++){             //攻撃、防御、魔攻撃、魔防御のステータスの差異を算出(各ステータス2倍で＋4レべとする)
            diffstats += (plusStats[i+2] / enemy.params[i+2]) * 4;
        }
        diffstats = Math.round(diffstats);
        return diffstats
    }

    function MakeLevels(id){
        if($gameTroop._enemies[Number(id)]._level === undefined){ $gameTroop._enemies[Number(id)]._level = 0; }
    }

    var _STR_enemy_name = Game_Enemy.prototype.name;
    Game_Enemy.prototype.name = function() {     //名前にレベルを表記する。（敵A,敵Bなどのアルファベットの表記は削除）
        var name = this.originalName();
        console.log(this._level);
        if(this._level !== 0 && this._level !== undefined){
            name = name + "  " + this._level +"Lv"
        }else{
            name = name + "  " + "1Lv"
        }
        return name
    }

    var _STR_enemy_exp = Game_Enemy.prototype.exp;
    Game_Enemy.prototype.exp = function() {   //敵のレベルに応じて経験値を増やす
        var exp = _STR_enemy_exp.call(this);
        if(this._level !== undefined){
            exp += Math.round(exp * (this._level * 0.2));
        }
        console.log(exp);
        return exp
    };

})(this);