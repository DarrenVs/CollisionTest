function updateObjectsGrid( Obj ) {
    
    if (Obj.stage != undefined) {
        var newGrids = Obj.stage.CollisionGrid.new( Obj );

        for (var oldGrid in Obj.oldGrids) {

            if (newGrids[oldGrid] == undefined)
                delete Obj.stage.CollisionGrid.grid[oldGrid][Obj.ID];
        }

        Obj.oldGrids = newGrids;

        Obj.stage.CollisionLoop[Obj.ID] = Obj;

        for (var i in Obj.childs) {

            if (Obj.childs[i].extends.collision)
                Obj.childs[i].position = Obj.childs[i].position;
        }
    }
}


//Sub Class
function Collision(Parent) {
    var Parent = Parent;
    var self = this;
    
    
    Parent.canCollide = true;
    Parent.colliderType = Parent.colliderType || Enum.colliderType.polygon;
    Parent.hitbox = new Polygon();
    Parent.mass = Parent.mass || 1;
    Parent.ignoreObjectIDs = Parent.ignoreObjectIDs || {};
    Parent.ignoreObjectType = Parent.ignoreObjectType || {};
    Parent.collisionStay = Parent.collisionStay || {};
    Parent.collisionEnter = Parent.collisionEnter || {};
    Parent.collisionExit = Parent.collisionExit || {};
    Parent.collisionActive = Parent.collisionActive ||true;
    
    Parent.oldGrids = {};
    
    
    
    Parent.Position = Vector2.new();
    Parent.Position.X = Parent.position.x;
    Parent.Position.Y = Parent.position.y;
    
    
    Parent.__defineSetter__('position', function(val) {
        
        if (val != undefined && val.x != undefined && val.y != undefined && val.x != NaN && val.y != NaN) {
            Parent.Position.X = val.x;
            Parent.Position.Y = val.y;
            
            updateObjectsGrid( Parent );
        }
    })
    Parent.__defineGetter__('position', () => {
        return Parent.Position;
    })
    
    
    
    Parent.Position.__defineSetter__('x', (val) => {
        
        if (val != undefined && val != NaN) {
            Parent.Position.X = val;
            
            updateObjectsGrid( Parent );
        }
    })
    Parent.Position.__defineGetter__('x', () => {
        return Parent.Position.X;
    })
    
    
    
    Parent.Position.__defineSetter__('y', (val) => {
        
        if (val != undefined && val != NaN) {
            Parent.Position.Y = val;
            
            updateObjectsGrid( Parent );
        }
    })
    Parent.Position.__defineGetter__('y', () => {
        return Parent.Position.Y;
    })
    
    
    Parent.position = Parent.position;
    
    
    
    
    
    Parent.__defineGetter__('collisionDirection', () => {
        return Vector2.unit(Vector2.divide(Parent.CollisionDirection, Parent.collisionCount));
    })
    Parent.__defineSetter__('collisionDirection', (val) => {
        Parent.CollisionDirection = val;
    })
    Parent.__defineGetter__('collisionDepth', () => {
        return Parent.CollisionDepth / Parent.collisionCount;
    })
    Parent.__defineSetter__('collisionDepth', (val) => {
        Parent.CollisionDepth = val;
    })
    
    
    Parent.collisions = {};
    
    
    Parent.collisionStay["collision"] = function( collisionInfo ) {
        
        if (Parent.anchored != undefined && !Parent.anchored && collisionInfo.canCollide) {
            
            var force;
            if (Parent.mass < collisionInfo.Object.mass)
                force = Parent.mass / collisionInfo.Object.mass;
            else
                force = -(collisionInfo.Object.mass / Parent.mass) + 1;
            
            if (Parent.mass == collisionInfo.Object.mass) force = 0.5;
            else if (collisionInfo.Object.mass <= 0) force = 0;
            else if (Parent.mass <= 0) force = 1;
            
            if (collisionInfo.Object.mass > 0) {
                Parent.position = Vector2.add(
                    Parent.position,
                    // +
                    Vector2.multiply(Vector2.multiply(
                        collisionInfo.direction,
                        // *
                        collisionInfo.distanceToEdge //* (collisionInfo.Object.anchored ? 1 : 1)
                    ),force)
                );
            }
        }
    }
    
    return true;
}


function updateCollision( Obj1, deltaTime ) {
    
    if (Obj1 && Obj1.stage != undefined) {
        Obj1.stage.testedObjects[ Obj1.ID ] = true;
        
        for (var grid in Obj1.oldGrids) {
            for (var Obj2ID in Obj1.stage.CollisionGrid.grid[ grid ]) {

                var Obj2 = activeObjects[ Obj2ID ];
                
                if (Obj2 == undefined || !Obj2.extends.collision) //Clear dead/recycled objects
                    delete Obj1.stage.CollisionGrid.grid[ grid ][ Obj2ID ];
                    
                else if (Obj1.ID != Obj2ID && Obj2.extends.collision != undefined) {
                    
                    //Get collision info
                    collisionInfo = CheckCollision(Obj1, Obj2, deltaTime);
                    
                    if (collisionInfo) {
                        
                        Obj1.collisions[ Obj2.ID ] = Obj1.collisions[ Obj2.ID ] || {};
                        for (var index in collisionInfo) Obj1.collisions[ Obj2.ID ][ index ] = collisionInfo[ index ];
                        
                        Obj1.collisions[ Obj2.ID ].lifeTime = Obj1.collisions[ Obj2.ID ].lifeTime || 2;
                        
                        
                        //Give the second object the same collision info
                        collisionInfo2 = {
                            collision: true,
                            Object: Obj1,
                            canCollide: collisionInfo.canCollide,
                            position1: collisionInfo.position2,
                            position2: collisionInfo.position1,
                            velocity1: collisionInfo.velocity2,
                            velocity2: collisionInfo.velocity1,
                            direction: Vector2.multiply( collisionInfo.direction, -1 ),
                            distanceToEdge: collisionInfo.distanceToEdge,
                        }
                        Obj2.collisions[ Obj1.ID ] = Obj2.collisions[ Obj1.ID ] || {};
                        for (var index in collisionInfo2) Obj2.collisions[ Obj1.ID ][ index ] = collisionInfo2[ index ];
                        
                        Obj2.collisions[ Obj1.ID ].lifeTime = Obj2.collisions[ Obj1.ID ].lifeTime || 2;
                        
                        Obj1.stage.CollisionLoop[Obj1.ID] = Obj1;
                        Obj2.stage.CollisionLoop[Obj2.ID] = Obj2;
                    } else if (!Obj2.stage.testedObjects[ Obj2.ID ]) {
                        
                        updateCollision( Obj2, deltaTime );
                    }
                }
            }
        }

        for (var Obj2ID in Obj1.collisions) {

            var collisionInfo = Obj1.collisions[ Obj2ID ];
            var Obj2 = activeObjects[ Obj2ID ];


            if (collisionInfo.lifeTime == 2) {
                for (var i in Obj1.collisionEnter)
                    Obj1.collisionEnter[ i ](collisionInfo);

            } else if (collisionInfo.lifeTime <= 0) {
                for (var i in Obj1.collisionExit)
                    Obj1.collisionExit[ i ](collisionInfo);

            } if (collisionInfo.lifeTime > 0 && collisionInfo.lifeTime < 2) {
                for (var i in Obj1.collisionStay)
                    Obj1.collisionStay[ i ](collisionInfo);

                delete Obj1.collisions[ Obj2ID ];
            }

            collisionInfo.lifeTime -= 1;
        }
    }
}



//draw debug lines
var lineFromTo = (v1,v2) => {
    ctx.resetTransform();
    ctx.beginPath();
    ctx.moveTo( v1.x, v1.y );
    ctx.lineTo( v2.x, v2.y );
    ctx.stroke();
    ctx.closePath();
}



function CheckCollision( Obj1, Obj2, deltaTime ) {
    
    //Check if the object has the right properties to make a collision with the other object (used for collision events)
    var canCollide =  (!Obj1.ignoreObjectIDs[Obj2.ID]             
                    && !Obj2.ignoreObjectIDs[Obj1.ID]           
                    && !Obj1.ignoreObjectType[Obj2.ClassType]   
                    && !Obj2.ignoreObjectType[Obj1.ClassType]
                    && Obj1.canCollide
                    && Obj2.canCollide);
    
    
    //Check for collision type
    if (Obj1.colliderType == Enum.colliderType.polygon && Obj2.colliderType == Enum.colliderType.polygon) {
        
        
        //Check simple box collision of the polygon first
        if ((Obj1.globalPosition.x + Obj1.hitbox.x*.5 > Obj2.globalPosition.x - Obj2.hitbox.x*.5 &&
             Obj1.globalPosition.x - Obj1.hitbox.x*.5 < Obj2.globalPosition.x + Obj2.hitbox.x*.5)
        &&  (Obj1.globalPosition.y + Obj1.hitbox.y*.5 > Obj2.globalPosition.y - Obj2.hitbox.y*.5 &&
             Obj1.globalPosition.y - Obj1.hitbox.y*.5 < Obj2.globalPosition.y + Obj2.hitbox.y*.5)) {
            
            //If there's a box collision between the 2 objects, continue calculating the complex polygon collision
            
            var minDirection = Vector2.directions.right,
                minDistance = Infinity,
                minEdge = false,
                minDot = false,
                foundPoint = false;

            for (var pointIndex in Obj2.hitbox.points) {

                var coll = true, //turn this to false if there's at least one non-match
                    Obj2hitboxPoint = Vector2.add( Obj2.globalPosition, Obj2.hitbox.points[ pointIndex ] ),
                    edgeDistance = Infinity,
                    edgeDirection = Vector2.directions.right,
                    edgePosition = Vector2.directions.right;


                for (var edgeIndex in Obj1.hitbox.edges) {

                    var edge = Obj1.hitbox.edges[ edgeIndex ],
                        joint = Vector2.add( Obj1.globalPosition, edge.edge ),
                        parpen = Vector2.add( edge.parpen, joint ),
                        dotproduct = Vector2.dotproduct( Vector2.unit(Vector2.subtract( joint, parpen )), Vector2.subtract( joint, Obj2hitboxPoint ) );


                    if (dotproduct+1 <= 0) {

                        coll = false;
                    } else {

                        if (Math.abs( dotproduct ) < edgeDistance) {
                            edgeDistance = Math.abs( dotproduct );
                            edgeDirection = Vector2.unit( Vector2.subtract( parpen, joint ) );
                            edgePosition = joint;
                        }
                    }

                }

                if (coll == true) {
                    foundPoint = true;

                    minDistance = edgeDistance;
                    minDirection = edgeDirection;
                    minEdge = edgePosition;
                    minDot = Obj2hitboxPoint;
                    //break;
                }
            }


            if (foundPoint == true) {
                lineFromTo(minEdge, Vector2.add( Vector2.multiply( minDirection, minDistance ), minEdge ));
                //lineFromTo(minDot, minEdge);
                return {
                    collision: true,
                    Object: Obj2,
                    canCollide: canCollide,
                    position1: minEdge,
                    position2: minDot,
                    velocity1: Obj1.velocity ? Vector2.new(Obj1.velocity.x, Obj1.velocity.y) : Vector2.new(),
                    velocity2: Obj2.velocity ? Vector2.new(Obj2.velocity.x, Obj2.velocity.y) : Vector2.new(),
                    direction: minDirection,
                    distanceToEdge: minDistance+1,
                };
            }
        }
    }
    
    //Return results if there was no collision
    return false;
}