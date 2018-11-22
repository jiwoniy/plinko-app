/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function CSpriteLibrary() {
    this._oLibSprites = {};

    this._iNumSprites = 0;
    this._iCntSprites = 0;

    this._cbCompleted = null
    this._cbTotalCompleted = null
    this._cbOwner = null
}

CSpriteLibrary.prototype.init = function(cbCompleted, cbTotalCompleted, cbOwner) {
    this._cbCompleted = cbCompleted;
    this._cbTotalCompleted = cbTotalCompleted;
    this._cbOwner     = cbOwner;
};

CSpriteLibrary.prototype._onSpriteLoaded = function() {
    this._cbCompleted.call(this._cbOwner);
    if (++this._iCntSprites === this._iNumSprites) {
        this._onSpritesLoaded();
    }
}

CSpriteLibrary.prototype.addSprite = function(szKey, szPath) {
    if (this._oLibSprites.hasOwnProperty(szKey)) {
        return;
    }
    
    const img = new Image()
    this._oLibSprites[szKey] = { szPath:szPath, oSprite: img };
    this._iNumSprites++;
}

CSpriteLibrary.prototype._onSpritesLoaded = function () {
    this._cbTotalCompleted.call(this._cbOwner);
}

CSpriteLibrary.prototype.getSprite = function (szKey) {
    if (!this._oLibSprites.hasOwnProperty(szKey)) {
        return null;
    } else {
        return this._oLibSprites[szKey].oSprite;
    }
}

CSpriteLibrary.prototype.loadSprites = function () {
    for (var szKey in this._oLibSprites) {
        this._oLibSprites[szKey].oSprite["oSpriteLibrary"] = this;
        this._oLibSprites[szKey].oSprite.onload = function() {
            this.oSpriteLibrary._onSpriteLoaded();
        };
        this._oLibSprites[szKey].oSprite.src = this._oLibSprites[szKey].szPath;
    } 
}

CSpriteLibrary.prototype.getNumSprites = function () {
    return this._iNumSprites;
}

export default CSpriteLibrary;
