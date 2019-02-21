cc.Class({
    extends: cc.Component,

    properties: {
        //星星与主角之间的距离小于这个值的时候，星星就会消失
        pickRadius:0,
    },
    onLoad () {
       // this.node.destory();
    },
    getPlayerDistance :function(){
        //根据player节点位置判断距离
        var playerPos = this.game.player.getPosition();
        //根据两点位置计算两点之间的距离
        var dist  = this.node.position.sub(playerPos).mag();
        return dist;
    },
    onPicked:function(){
        //当星星被收集时，调用game脚本中的接口，生成一个新的星星
        this.game.spawnNewStar();
        //然后摧毁当前星星节点
        this.node.destroy();
        //调用game脚本得分方法
        this.game.gainScore();

        
    },
    start () {

    },

    update (dt) {
        //每帧判断和主角之间的距离是否小于收集距离
        if(this.getPlayerDistance()<this.pickRadius){
            //调用收集行为
            this.onPicked();
            return ;
        }
        //根据game脚本中的计时器更新星星的透明度
        var opacityRatio = 1 - this.game.timer/this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity+Math.floor(opacityRatio*(255-minOpacity));
    },
});
