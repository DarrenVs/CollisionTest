Enum.classType.Dot = Dot;

//Sub Class
function Dot(properties) {
    var self = this;
    
    GameObject(self, properties, "Asteroid");
    
    this.extends = {
        physics: Physics(this),
        collision: Collision(this),
    };
    
    
    for (var i = 0; i<360; i+=360/Math.round(Math.random()*5+3)) {
        
        self.hitbox.add(
            Vector2.multiply( Vector2.fromAngle(i), 75 )
        );
    }
    
    
    self.anchored = false;
    self.mass = 100;
    self.colour = "#714b4b"
    
    self.start[ "fixSize" ] = () => {
        
        self.size = Vector2.new(20, 20);
    }
    
    ctx.lineWidth = 2;
    
    self.radius = 50;
    
    self.update[ "movement" ] = () => {
        
        if (MOUSE.mousedown && Vector2.magnitude( Vector2.subtract( self.stage.mousePosition, self.position ) ) <= self.radius ) {
            self.velocity = Vector2.add( self.velocity, Vector2.multiply( Vector2.subtract( self.stage.mousePosition, self.globalPosition ), .1 ) );
            lineFromTo(self.globalPosition, self.stage.mousePosition);
        }
    }
}