function Polygon(newPoints) {
    var self = this;
    
    self.points = [];
    self.edges = [];
    
    for (var index in newPoints) {
    
        if (newPoints[ index ].x != undefined && newPoints[ index ].y != undefined)
        points.push( newPoints[ index ] );
    }
    
    
    self.add = (point) => {
        
        if (point.x != undefined && point.y != undefined)
            self.points.push( point );
        
        buildEdges();
        var size = CalculateBoundrySizeFromPoints( self.points );
        self.x = size.x + 1;
        self.y = size.y + 1;
    }
    
    var buildEdges = () => {
        
        self.edges = [];
        var pointCount = self.points.length;
        
        for (var index = 0; index < pointCount; index++) {
            
            var point1 = self.points[ index ],
                point2 = self.points[ (index + 1 )%pointCount ];
            
            var edge = Vector2.multiply(Vector2.add(point1, point2), .5);
            var radius = Vector2.magnitude( Vector2.subtract( self.points[ index ], edge ) );
            
            self.edges.push( {
                edge: edge,
                radius: radius,
                point: point1,
                dir: Vector2.subtract(edge, point1),
                parpen: Vector2.perpendicular( Vector2.subtract(edge, point1) ),
            } );
        }
    }
    
    var CalculateBoundrySizeFromPoints = ( points ) => {

        var size = Vector2.new();
        for (var point in points) {

            if (Math.abs(points[ point ].x) * 2 > size.x)
                size.x = Math.abs(points[ point ].x) * 2;
            if (Math.abs(points[ point ].y) * 2 > size.y)
                size.y = Math.abs(points[ point ].y) * 2;
        }

        return size;
    }
}

