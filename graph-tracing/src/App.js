import React from 'react';
import './App.css';
import { PiGraph } from "react-icons/pi";
import { TiInfoLargeOutline } from "react-icons/ti";

function App() {
    const hashMarks = [];
    for (let i = 0; i <= 100; i += 20) {
        hashMarks.push(i);
    }

    const [showPointModal, setShowPointModal] = React.useState(false);

    const [showInfoModal, setShowInfoModal] = React.useState(false);

    const [selectedPoints, setSelectedPoints] = React.useState([]);

    const [visited, setVisited] = React.useState({"edges": [], "points": [], "distance": 0});

    const [points, setPoints] = React.useState([
        { x: 40, y: 50 },
        { x: 15, y: 25 },
        { x: 65, y: 30 },
        { x: 80, y: 43 },
        { x: 90, y: 90 }
    ]);
    const [edges, setEdges] = React.useState([
        { p1: 0, p2: 1, w: 5, dir: '3'},
        { p1: 1, p2: 2, w: 5, dir: '3'},
        { p1: 0, p2: 2, w: 2, dir: '1'},
        { p1: 2, p2: 3, w: 6, dir: '2'},
        { p1: 0, p2: 3, w: 3, dir: '3'},
        { p1: 3, p2: 4, w: 4, dir: '2'},

    ]);

    const [graphDimensions, setGraphDimensions] = React.useState({ width: 0, height: 0 });
    const gridRef = React.useRef(null);

    React.useEffect(() => {
        const handleResize = () => {
            if (gridRef.current) {
                const dimensions = gridRef.current.getBoundingClientRect();
                setGraphDimensions({ width: dimensions.width, height: dimensions.height });
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    React.useEffect(() => {
        if(selectedPoints.length == 2){
            // Use Dijkstra's algorithm to find the shortest path
            let graph = {};
            points.forEach((point, index) => {
                graph[index] = {};
            });

            edges.forEach(edge => {
                if(edge.dir === '3'){
                    graph[edge.p2][edge.p1] = Number(edge.w);
                    graph[edge.p1][edge.p2] = Number(edge.w);
                }
                else if(edge.dir === '1'){
                    graph[edge.p2][edge.p1] = Infinity;
                    graph[edge.p1][edge.p2] = Number(edge.w);
                }
                else if(edge.dir === '2'){
                    graph[edge.p1][edge.p2] = Infinity;
                    graph[edge.p2][edge.p1] = Number(edge.w);
                }
            });

            let visited = Array(points.length).fill(false);
            let distance = Array(points.length).fill(Infinity);
            let parent = Array(points.length).fill(-1);

            distance[selectedPoints[0]] = 0;

            for(let i = 0; i < points.length; i++){
                let min = -1;
                for(let j = 0; j < points.length; j++){
                    if(!visited[j] && (min === -1 || distance[j] < distance[min])){
                        min = j;
                    }
                }

                visited[min] = true;

                for(let j = 0; j < points.length; j++){
                    if(graph[min][j] && distance[j] > distance[min] + graph[min][j]){
                        distance[j] = distance[min] + graph[min][j];
                        parent[j] = min;
                    }
                }
            }

            let path = [];
            let current = selectedPoints[1];
            while(current !== -1){
                path.push(current);
                current = parent[current];
            }

            path.reverse();
            let pathEdges = [];
            for (let i = 0; i < path.length - 1; i++) {
                for (let j = 0; j < edges.length; j++) {
                    if ((edges[j].p1 === path[i] && edges[j].p2 === path[i + 1] && (edges[j].dir === '1' || edges[j].dir === '3')) ||
                        (edges[j].p1 === path[i + 1] && edges[j].p2 === path[i] && (edges[j].dir === '2' || edges[j].dir === '3'))) {
                        pathEdges.push(j);
                        break;
                    }
                }
            }


            console.log(edges, pathEdges);

            setVisited({"edges": pathEdges, "points": path, "distance": distance[selectedPoints[1]]});
        }
        else{
            setVisited({"edges": [], "points": [], "distance": Infinity});
        }
    }, [selectedPoints]);

    return (
        <div className="App">

            {
                visited.distance !== Infinity && (
                    <div
                        style={{
                            position: 'fixed',
                            top: '0px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: "40%",
                            gap: "20px",
                            minWidth: "200px",
                        }}
                    >
                        <p>Shortest Path: {visited.points.join(' -> ')}</p>
                        <p>Distance: {visited.distance}</p>
                    </div>
                )
            }

            {
                (visited.distance === Infinity && selectedPoints.length === 2) && (
                    <div
                        style={{
                            position: 'fixed',
                            top: '0px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: "40%",
                            gap: "20px",
                            minWidth: "200px",
                        }}
                    >
                        <p>No Path Found</p>
                    </div>
                )
            }

            <div className='legend'
                style={{
                    position: 'fixed',
                    bottom: '0px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'space-between',
                    width: '40%',
                    minWidth: '200px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center',
                        justifyContent: "space-between"
                    }}
                >
                    <div
                        style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                        }}
                    ></div>
                    <p>Selected Start Point</p>
                </div>

                <div
                    style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center',
                        justifyContent: "space-between"
                    }}
                >
                    <div
                        style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'blue',
                            borderRadius: '50%',
                        }}
                    ></div>
                    <p>Selected End Point</p>
                </div>

                <div
                    style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center',
                        justifyContent: "space-between"
                    }}
                >
                    <div
                        style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'green',
                            borderRadius: '50%',
                        }}
                    ></div>
                    <p>Visited Point/Edge</p>
                </div>
               
            </div>

            <div className="grid" ref={gridRef}>
                {hashMarks.filter(mark => mark !== 0 && mark !== 100).map((mark, index) => (
                    <div key={index} className="hashmark" style={
                        {
                            left: `${mark}%`,
                            bottom: 0,
                        }
                    }
                    ><p>{mark}</p></div>
                ))}
                {hashMarks.filter(mark => mark !== 0 && mark !== 100).map((mark, index) => (
                    <div key={index} className="hashmark" style={
                        {
                            bottom: `${mark}%`, 
                            left: 0,
                            width: 10,
                            height: 2,
                        }
                    }><p>{mark}</p></div>
                ))}
            </div>

            {edges.map((edge, index) => {
                    const point1 = points[edge.p1];
                    const point2 = points[edge.p2];

                    let x1 = Number(point1.x);
                    let y1 =  100 - Number(point1.y);

                    let x2 = Number(point2.x);
                    let y2 =  100 - Number(point2.y);


                    let x1Pixels = (x1 * graphDimensions.width) / 100;
                    let y1Pixels = (y1 * graphDimensions.height) / 100;

                    let x2Pixels = (x2 * graphDimensions.width) / 100;
                    let y2Pixels = (y2 * graphDimensions.height) / 100;
                    
                    // Calculate the mid point of the line
                    const rectMidX = (x1Pixels + x2Pixels) / 2;
                    const rectMidY = (y1Pixels + y2Pixels) / 2;

                    return (
                        <svg key={index}
                            style={{
                                position: 'fixed',
                                width: '90%',
                                height: '90%',
                                userSelect: 'none',
                            }}
                        >
                            <line
                                x1={`${x1}%`}
                                y1={`${y1}%`}
                                x2={`${x2}%`}
                                y2={`${y2}%`}
                                style={{
                                    stroke: visited.edges.includes(index) ? 'green' : 'black',
                                    strokeWidth: 2,
                                }}
                            />

                            <rect
                                x={rectMidX - (20 + edge.w.toString().length * 50) / 2} // Adjust these values as needed
                                y={rectMidY - 25} // Adjust these values as needed
                                width={20 + edge.w.toString().length * 50} // Adjust these values as needed
                                height="50"
                                style={{
                                    fill: 'white',
                                    stroke: 'black',
                                    strokeWidth: 1,
                                }}
                            />

                            <text
                                x={rectMidX}
                                y={rectMidY}
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                style={{
                                    fontSize: 18,
                                    fill: 'black',
                                }}
                            >
                                <tspan x={rectMidX} dy="0px">{edge.w}</tspan>
                                <tspan x={rectMidX} dy="20px">
                                    {
                                        edge.dir === '1' ? `${edge.p1} -> ${edge.p2}`
                                        : edge.dir === '2' ? `${edge.p2} -> ${edge.p1}`
                                        : `${edge.p1} <-> ${edge.p2}`
                                    }
                                </tspan>
                            </text>

                        </svg>
                    );
                })}

            <div
                style={{
                    position: 'fixed',
                    width: '90%',
                    height: '90%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
            {points.map((point, index) => {

                let x = Number(point.x);
                let y =  100 - Number(point.y);

                let xPixels = (x * graphDimensions.width) / 100;
                let yPixels = (y * graphDimensions.height) / 100;

                return (
                    <div key={index}
                        style={{
                            position: 'absolute',
                            left: xPixels - 25,
                            top: yPixels - 25,
                            width: 40,
                            height: 40,
                            backgroundColor: selectedPoints.includes(index) ? selectedPoints.indexOf(index) === 0 ? 'red' : 'blue' : (visited.points.includes(index) ? 'green' : 'white'),
                            borderRadius: '50%',
                            border: '1px solid black',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            userSelect: 'none',
                        }}
                        onClick={() => {
                            if (selectedPoints.includes(index)) {
                                setSelectedPoints(selectedPoints.filter(point => point !== index));
                            }
                            else{
                                if (selectedPoints.length == 0){
                                    setSelectedPoints([index]);
                                }
                                else if (selectedPoints.length == 1){
                                    setSelectedPoints([selectedPoints[0], index]);
                                }
                                else{
                                    setSelectedPoints([selectedPoints[1], index]);
                                }
                            }
                        }}
                    >
                        <p style={{ margin: 0 }}>{index}</p>
                    </div>
                );
            })}
            </div>

            <div
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    fontSize: '30px',
                    border: '1px solid black',
                    borderRadius: '10px',
                    padding: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: "lightblue",
                    cursor: 'pointer',
                }}
                onClick={() => setShowPointModal(!showPointModal)}
            >
                <PiGraph />
            </div>

            <div
                style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    fontSize: '30px',
                    border: '1px solid black',
                    borderRadius: '10px',
                    padding: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: "lightblue",
                    cursor: 'pointer',
                }}
                onClick={() => setShowInfoModal(!showInfoModal)}
            >
                <TiInfoLargeOutline />
            </div>

            {showPointModal && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '10px',
                        border: '1px solid black',
                        minWidth: 400,
                        minHeight: 400,
                        width: '80%',
                        maxWidth: 600,
                        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
                        maxHeight: 600,
                        overflowY: 'auto',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid black',
                        }}
                    >
                        <h1>Edit Graph</h1>
                        <button onClick={() => setShowPointModal(false)}
                            style={{
                                backgroundColor: 'red',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '5px',
                                cursor: 'pointer',
                                fontSize: '20px',
                                width: '30px',
                                height: '30px',
                            }}
                        >X</button>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px',
                            gap: '30px',
                        }}
                    >
                        <div>
                            <h2>Points</h2>

                            <table
                                style={{
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    marginBottom: '10px',
                                    textAlign: 'center',
                                    borderBottom: '1px solid black',
                                    
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>X</th>
                                        <th>Y</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {points.map((point, index) => (
                                        <tr key={index}>
                                            <td>{index}</td>
                                            <td>{point.x}</td>
                                            <td>{point.y}</td>
                                            <td>
                                                <button
                                                    style={{
                                                        backgroundColor: 'red',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        padding: '5px',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => {
                                                        const newPoints = points.filter((_, i) => i !== index);
                                                        setPoints(newPoints);
                                                    }}
                                                >X</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <input
                                type="number"
                                placeholder="X"
                                style={{
                                    padding: '5px',
                                    borderRadius: '5px',
                                    border: '1px solid black',
                                    marginRight: '10px',
                                    maxWidth: '50px',
                                }}
                                min={0}
                                max={100}
                            />
                            <input
                                type="number"
                                placeholder="Y"
                                style={{
                                    padding: '5px',
                                    borderRadius: '5px',
                                    border: '1px solid black',
                                    marginRight: '10px',
                                    maxWidth: '50px',
                                }}
                                min={0}
                                max={100}
                            />
                            <button
                                style={{
                                    padding: '5px',
                                    borderRadius: '5px',
                                    border: '1px solid black',
                                    backgroundColor: 'lightblue',
                                    cursor: 'pointer',
                                }}

                                onClick={() => {
                                    const x = document.querySelector('input[type="number"][placeholder="X"]').value;
                                    const y = document.querySelector('input[type="number"][placeholder="Y"]').value;
                                    if (x && y) {
                                        if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {

                                            let exists = points.find(point => point.x === x && point.y === y);
                                            if (exists) {
                                                return;
                                            }

                                            setPoints([...points, { x: parseFloat(x), y: parseFloat(y) }]);
                                        }
                                    }
                                }}

                            >Add</button>
                        </div>

                        <div>
                            <h2>Edges</h2>

                            <table
                                style={{
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    marginBottom: '10px',
                                    textAlign: 'center',
                                    borderBottom: '1px solid black',
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>P1</th>
                                        <th>P2</th>
                                        <th>W</th>
                                        <th>Dir</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {edges.map((edge, index) => (
                                        <tr key={index}>
                                            <td>{index}</td>
                                            <td>{edge.p1}</td>
                                            <td>{edge.p2}</td>
                                            <td>{edge.w}</td>
                                            <td>{edge.dir}</td>
                                            <td>
                                                <button
                                                    style={{
                                                        backgroundColor: 'red',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        padding: '5px',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => {
                                                        const newEdges = edges.filter((_, i) => i !== index);
                                                        setEdges(newEdges);
                                                    }}
                                                >X</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <input
                                type="number"
                                placeholder="P1"
                                style={{
                                    padding: '5px',
                                    borderRadius: '5px',
                                    border: '1px solid black',
                                    marginRight: '10px',
                                    maxWidth: '50px',
                                }}
                            />
                            <input
                                type="number"
                                placeholder="P2"
                                style={{
                                    padding: '5px',
                                    borderRadius: '5px',
                                    border: '1px solid black',
                                    marginRight: '10px',
                                    maxWidth: '50px',
                                }}
                            />
                            <input
                                type="number"
                                placeholder="W"
                                style={{
                                    padding: '5px',
                                    borderRadius: '5px',
                                    border: '1px solid black',
                                    marginRight: '10px',
                                    maxWidth: '50px',
                                }}
                            />
                            <select
                                style={{
                                    padding: '5px',
                                    borderRadius: '5px',
                                    border: '1px solid black',
                                    marginRight: '10px',
                                }}
                                defaultValue={3}
                            >
                                <option value={3} disabled>Dir</option>
                                <option value={1}>Up</option>
                                <option value={2}>Down</option>
                                <option value={3}>Both</option>
                            </select>
                            <button
                                style={{
                                    padding: '5px',
                                    borderRadius: '5px',
                                    border: '1px solid black',
                                    backgroundColor: 'lightblue',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    const p1 = document.querySelector('input[type="number"][placeholder="P1"]').value;
                                    const p2 = document.querySelector('input[type="number"][placeholder="P2"]').value;
                                    const w = document.querySelector('input[type="number"][placeholder="W"]').value;
                                    const dir = document.querySelector('select').value;
                                    if (p1 && p2 && w) {
                                        if (p1 >= 0 && p1 <= points.length && p2 >= 0 && p2 <= points.length) {

                                            let exists = edges.find(edge => edge.p1 === p1 && edge.p2 === p2);
                                            if (exists) {
                                                return;
                                            }

                                            setEdges([...edges, {p1: parseInt(p1), p2:parseInt(p2), w:parseFloat(w), dir }]);
                                        }
                                    }
                                }}
                            >Add</button>
                        </div>

                    </div>

                </div>
            )}

            {showInfoModal && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '10px',
                        border: '1px solid black',
                        minWidth: 400,
                        minHeight: 400,
                        width: '80%',
                        maxWidth: 600,
                        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
                        maxHeight: 800,
                        overflowY: 'auto',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid black',
                        }}
                    >
                        <h1>Info</h1>
                        <button onClick={() => setShowInfoModal(false)}
                            style={{
                                backgroundColor: 'red',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '5px',
                                cursor: 'pointer',
                                fontSize: '20px',
                                width: '30px',
                                height: '30px',
                            }}
                        >X</button>
                    </div>

                    <div
                        style={{
                            padding: '10px',
                            textAlign: 'left',
                        }}
                    >
                        <h2>Instructions</h2>
                        <p>This is a graph visualizer that uses Dijkstra's algorithm to find the shortest path between two points.</p>
                        <p>Click on a point to select it. The first point you select will be the starting point and the second point will be the ending point.</p>
                        <p>Click on an already selected point to deselect it.</p>
                        <p>Click on the graph icon in the top right to edit the graph.</p>
                        <p>If a path is found, it will be displayed at the top of the screen and highlighted in green.</p>
                        <p>Each edge has a weight and a direction. The direction is indicated by the following:</p>
                        <ul>
                            <li>1: Up (from p1 to p2)</li>
                            <li>2: Down (from p2 to p1)</li>
                            <li>3: Both (from p1 to p2 and from p2 to p1)</li>
                        </ul>
                        <p>The edge data is displayed in the middle of the edge. The weight is displayed at the top and the direction is displayed at the bottom.</p>
                    </div>

                </div>
            )}

        </div>
    );
}

export default App;