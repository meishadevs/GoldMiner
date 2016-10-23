//通天河场景
var TongTianHeLayer = cc.Layer.extend(
{
    ctor:function ()
    {
        this._super();

        console.log("通天河");

        return true;
    }
});

var SceneTongTianHe = cc.Scene.extend(
{
    onEnter:function ()
    {
        this._super();
        var layer = new TongTianHeLayer();
        this.addChild(layer);
    }
});

