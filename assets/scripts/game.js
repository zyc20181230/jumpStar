cc.Class({
    extends: cc.Component,

    properties: {
        //这个属性引用了星星的预制资源
        starPrefab:{
            default:null,
            type:cc.Prefab
        },
        //星星产生后消失时间的随机范围
        maxStarDuration:0,
        minStarDuration:0,
        //地面节点,用于确定星星生成的高度
        ground:{
            default:null,
            type:cc.Node
        },
        //player节点，用于获取主角弹跳高度，和控制主角行动开关
        player:{
            default:null,
            type:cc.Node
        },
        //score label 的引用
        scoreDisplay:{
            default:null,
            type:cc.Label
        },
        //得分音效资源
        scoreAudio:{
            default:null,
            type:cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         //获取地面的Y轴坐标
         this.groundY=this.ground.y+this.ground.height/2;
         //初始化计时器
         this.timer = 0;
         this.starDuration = 0;
         //生成一个星星
         this.spawnNewStar();
         //初始化分数
         this.score = 0;
         
          

     },
    start () {

    },
    spawnNewStar:function(){
        //使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab);
        //将新增节点添加到Canvas节点下面
        this.node.addChild(newStar);
        //为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        //在星星上暂存Game对象的引用
        newStar.getComponent('Star').game = this;
        //重置计时器，根据消失时间范围随机选取一个值
        this.starDuration = Math.random()*(this.maxStarDuration-this.minStarDuration)+this.minStarDuration;
        this.timer=0;

    },
    getNewStarPosition:function(){
        var randX=0;
        //根据地面位置和主角跳跃高度，随机得到一个星星的y坐标
        var randY=this.groundY+Math.random()*this.player.getComponent('Player').jumpHeight+50;
        //根据屏幕宽度，随机得到一个星星的x坐标
        var maxX = this.node.width/2;
        randX=(Math.random()-0.5)*2*maxX;
        //返回星星的坐标
        return cc.v2(randX,randY);
    },
    update (dt) {
        //每帧更新计时器，超过限度还没有生成新的星星，超过限度就会生成新的星星
        if(this.timer>this.starDuration){
            this.gameOver();
            return ;
        }
        this.timer+=dt;
    },
    gainScore:function(){
        this.score+=1;
        //更新scoreDisplay Label显示的文字
        this.scoreDisplay.string='Score:'+this.score;
        //播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio,false);
    },
    gameOver:function(){
        this.player.stopAllActions();//停止player节点的跳跃动作
        cc.director.loadScene('game'); //重新加载游戏场景game
    },
});
