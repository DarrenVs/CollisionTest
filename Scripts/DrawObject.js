addDrawObject = function( Obj ) {
    
    Obj.DrawObject = new DrawObject( Obj )
}

//Base Class
function DrawObject(Parent) {
    var self = this;
    this.parent = Parent;

    this.update = function () {

        transformObject(this.parent)

        ctx.fillStyle = "black";//self.parent.color;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
        
        ctx.strokeRect(-self.parent.size.x * 0.5, -self.parent.size.y * 0.5, self.parent.size.x, self.parent.size.y);
        
        if (self.parent.colliderType == Enum.colliderType.polygon && self.parent.hitbox.points != undefined && self.parent.hitbox.points[ 0 ] != undefined) {
            
            ctx.strokeRect(-self.parent.hitbox.x * 0.5, -self.parent.hitbox.y * 0.5, self.parent.hitbox.x, self.parent.hitbox.y);
            
            ctx.beginPath();
            var pos = self.parent.hitbox.points[ 0 ];
            ctx.moveTo( pos.x, pos.y );
            
            var length = self.parent.hitbox.points.length;
            for (var i = 1; i < length; i++) {
                
                var pos = self.parent.hitbox.points[ i ];
                
                ctx.lineTo( pos.x, pos.y );
            }
            
            ctx.closePath();
            //ctx.fill();
            ctx.stroke();
        }
        
        if (self.parent.text) {
            
            ctx.font = "18px Arial";
            ctx.textAlign = self.parent.textAlign ? self.parent.textAlign : "center";
            ctx.strokeStyle = self.parent.strokeColor ? self.parent.strokeColor : "rgba(182, 189, 208, 0.72)";
            ctx.fillStyle = "rgba(47, 38, 38, 0.72)";
            if (self.textColor) ctx.fillStyle = self.textColor;
            ctx.strokeText(
                self.parent.text,
                self.parent.textOffset ? self.parent.textOffset.x : 0,
                self.parent.textOffset ? self.parent.textOffset.y : 0
            );
            ctx.fillText(
                self.parent.text,
                self.parent.textOffset ? self.parent.textOffset.x : 0,
                self.parent.textOffset ? self.parent.textOffset.y : 0
            );
        }
    }
}