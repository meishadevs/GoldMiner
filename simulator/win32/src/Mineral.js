/**
 * 建一个继承自精灵的矿石类
 */
var Mineral = cc.Sprite.extend(
{
    //记录矿石的类型
    type:null,

    //记录矿石的分值
    score:0,

    //标记矿石是不是炸药
    isExplosive:null,

    //地鼠的编号
    ctor:function ()
    {
        this._super();

        return true;
    },

    //设置矿石的类型
    setType:function(type)
    {
        this.type = type;
    },

    //获得矿石的类型
    getType:function()
    {
        return type;
    },

    //设置矿石的分值
    setScore:function(score)
    {
        this.score = score;
    },

    //获得矿石的分值
    getScore:function()
    {
        return score;
    },

    //获得矿石是不是炸药
    getIsExplosive:function()
    {
        return isExplosive;
    },

    //设置矿石是不是炸药
    setIsExplosive:function(isExplosive)
    {
        this.isExplosive = isExplosive;
    }
})