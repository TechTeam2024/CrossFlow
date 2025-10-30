import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Panel,
  useReactFlow,
} from 'reactflow';
import { toPng } from 'html-to-image';
import 'reactflow/dist/style.css';
import './Flowchart.css';

import {
  RectangleNode,
  DiamondNode,
  CircleNode,
  ParallelogramNode,
  TextNode,
} from './FlowchartNodes';

const nodeTypes = {
  rectangle: RectangleNode,
  diamond: DiamondNode,
  circle: CircleNode,
  parallelogram: ParallelogramNode,
  text: TextNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'circle',
    data: { label: 'Start' },
    position: { x: 250, y: 50 },
  },
];

const initialEdges = [];

const questions = [
  {
    id: 1,
    text: "Question 1: A musical AI creates a “melody pattern” where each new note’s frequency equals the sum of the previous two.",
    description: "Design a flowchart that uses recursion to generate the first N notes of this melody (Fibonacci pattern)."
  },
  {
    id: 2,
    text: "Question 2: Design a flowchart to simulate a robot moving across 10 tiles.",
    description: " The robot should skip tile 5 if it is blocked, but stop completely if an obstacle is detected on any other tile. tile_count = 10  For each tile (1 to 10), input the status: 0 → No obstacle 1 → Obstacle present"
  },
  {
    id: 3,
    text: "Question 3: Write a flowchart to find the largest of three numbers.",
    description: "Create a flowchart that takes three numbers as input and finds the largest one."
  },
];

export default function Flowchart() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionCanvases, setQuestionCanvases] = useState(
    questions.map(() => ({
      nodes: [{ id: '1', type: 'circle', data: { label: 'Start' }, position: { x: 250, y: 50 } }],
      edges: [],
      nodeIdCounter: 2
    }))
  );
  
  const currentCanvas = questionCanvases[currentQuestion];
  const [nodes, setNodes, onNodesChange] = useNodesState(currentCanvas.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(currentCanvas.edges);
  const [selectedNodeType, setSelectedNodeType] = useState('rectangle');
  const [selectedElements, setSelectedElements] = useState([]);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Custom keyboard handler to only delete edges, not nodes
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        
        // Only delete edges, not nodes
        const selectedEdges = selectedElements.filter(el => el.source !== undefined);
        if (selectedEdges.length > 0) {
          setEdges((eds) => {
            const filtered = eds.filter((edge) => !selectedEdges.find((sel) => sel.id === edge.id));
            // Sync with questionCanvases
            setQuestionCanvases(prev => {
              const updated = [...prev];
              updated[currentQuestion] = {
                ...updated[currentQuestion],
                edges: filtered
              };
              return updated;
            });
            return filtered;
          });
          setSelectedElements([]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedElements, setEdges, currentQuestion]);

  // Wrap onNodesChange to sync position changes
  const handleNodesChange = useCallback((changes) => {
    onNodesChange(changes);
    // Sync position changes with questionCanvases
    const positionChanges = changes.filter(change => change.type === 'position' && change.dragging === false);
    if (positionChanges.length > 0) {
      setNodes((nds) => {
        // Sync with questionCanvases
        setQuestionCanvases(prev => {
          const updated = [...prev];
          updated[currentQuestion] = {
            ...updated[currentQuestion],
            nodes: nds
          };
          return updated;
        });
        return nds;
      });
    }
  }, [onNodesChange, currentQuestion, setNodes]);

  // Wrap onEdgesChange to sync edge changes
  const handleEdgesChange = useCallback((changes) => {
    onEdgesChange(changes);
    setEdges((eds) => {
      // Sync with questionCanvases
      setQuestionCanvases(prev => {
        const updated = [...prev];
        updated[currentQuestion] = {
          ...updated[currentQuestion],
          edges: eds
        };
        return updated;
      });
      return eds;
    });
  }, [onEdgesChange, currentQuestion, setEdges]);

  // Navigate to next question
  const goToNextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  }, [currentQuestion]);

  // Navigate to previous question
  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  }, [currentQuestion]);

  // Load canvas when question changes
  React.useEffect(() => {
    const canvas = questionCanvases[currentQuestion];
    setNodes(canvas.nodes);
    setEdges(canvas.edges);
  }, [currentQuestion, questionCanvases, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => {
        const newEdges = addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: false,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 30,
              height: 30,
              color: '#FF8A00',
            },
            style: {
              strokeWidth: 3,
              stroke: '#FF8A00',
            },
          },
          eds
        );
        // Sync with questionCanvases
        setQuestionCanvases(prev => {
          const updated = [...prev];
          updated[currentQuestion] = {
            ...updated[currentQuestion],
            edges: newEdges
          };
          return updated;
        });
        return newEdges;
      }),
    [setEdges, currentQuestion]
  );

  const addNode = useCallback(() => {
    const currentCounter = questionCanvases[currentQuestion].nodeIdCounter;
    const newNodeId = `${currentCounter}`;
    const defaultLabel = `${selectedNodeType.charAt(0).toUpperCase() + selectedNodeType.slice(1)} ${currentCounter}`;
    
    // Get the center of the viewport
    const centerX = reactFlowInstance ? reactFlowInstance.getViewport().x : 250;
    const centerY = reactFlowInstance ? reactFlowInstance.getViewport().y : 150;
    
    const newNode = {
      id: newNodeId,
      type: selectedNodeType,
      data: {
        label: defaultLabel,
        onLabelChange: (newLabel) => {
          setNodes((nds) => {
            const updated = nds.map((node) =>
              node.id === newNodeId
                ? { ...node, data: { ...node.data, label: newLabel } }
                : node
            );
            // Sync with questionCanvases
            setQuestionCanvases(prev => {
              const updatedCanvases = [...prev];
              updatedCanvases[currentQuestion] = {
                ...updatedCanvases[currentQuestion],
                nodes: updated
              };
              return updatedCanvases;
            });
            return updated;
          });
        },
      },
      position: {
        x: Math.abs(centerX) + Math.random() * 100 + 150,
        y: Math.abs(centerY) + Math.random() * 100 + 150,
      },
    };

    setNodes((nds) => {
      const updatedNodes = nds.concat(newNode);
      // Sync with questionCanvases immediately
      setQuestionCanvases(prev => {
        const updated = [...prev];
        updated[currentQuestion] = {
          ...updated[currentQuestion],
          nodes: updatedNodes,
          nodeIdCounter: currentCounter + 1
        };
        return updated;
      });
      return updatedNodes;
    });
  }, [selectedNodeType, currentQuestion, questionCanvases, setNodes, reactFlowInstance]);

  const onNodesDelete = useCallback(
    (deleted) => {
      setNodes((nds) => {
        const filtered = nds.filter((node) => !deleted.find((d) => d.id === node.id));
        // Sync with questionCanvases
        setQuestionCanvases(prev => {
          const updated = [...prev];
          updated[currentQuestion] = {
            ...updated[currentQuestion],
            nodes: filtered
          };
          return updated;
        });
        return filtered;
      });
    },
    [setNodes, currentQuestion]
  );

  const onEdgesDelete = useCallback(
    (deleted) => {
      setEdges((eds) => {
        const filtered = eds.filter((edge) => !deleted.find((d) => d.id === edge.id));
        // Sync with questionCanvases
        setQuestionCanvases(prev => {
          const updated = [...prev];
          updated[currentQuestion] = {
            ...updated[currentQuestion],
            edges: filtered
          };
          return updated;
        });
        return filtered;
      });
    },
    [setEdges, currentQuestion]
  );

  const onSelectionChange = useCallback(({ nodes: selectedNodes, edges: selectedEdges }) => {
    setSelectedElements([...selectedNodes, ...selectedEdges]);
  }, []);

  const deleteSelected = useCallback(() => {
    const selectedNodes = selectedElements.filter(el => el.type !== undefined);
    const selectedEdges = selectedElements.filter(el => el.source !== undefined);
    
    // Only delete edges if edges are selected (don't delete connected nodes)
    if (selectedEdges.length > 0) {
      setEdges((eds) => eds.filter((edge) => !selectedEdges.find((sel) => sel.id === edge.id)));
      setSelectedElements([]); // Clear selection after deleting edges
    } 
    // Only delete nodes if explicitly selected (and there are no edges selected)
    else if (selectedNodes.length > 0) {
      if (window.confirm(`Delete ${selectedNodes.length} node(s)?`)) {
        setNodes((nds) => nds.filter((node) => !selectedNodes.find((sel) => sel.id === node.id)));
        // Also delete edges connected to these nodes
        setEdges((eds) => eds.filter((edge) => 
          !selectedNodes.find((sel) => sel.id === edge.source || sel.id === edge.target)
        ));
        setSelectedElements([]);
      }
    } else {
      alert('No elements selected. Click on a node or edge to select it first.');
    }
  }, [selectedElements, setNodes, setEdges]);

  const clearCanvas = useCallback(() => {
    if (window.confirm('Are you sure you want to clear this question\'s flowchart?')) {
      setNodes([]);
      setEdges([]);
      setQuestionCanvases(prev => {
        const updated = [...prev];
        updated[currentQuestion] = {
          nodes: [],
          edges: [],
          nodeIdCounter: 1
        };
        return updated;
      });
    }
  }, [currentQuestion, setNodes, setEdges]);

  const downloadFlowchart = useCallback(() => {
    if (reactFlowWrapper.current === null) {
      return;
    }

    // Hide controls and minimap for cleaner export
    const controls = reactFlowWrapper.current.querySelector('.react-flow__controls');
    const minimap = reactFlowWrapper.current.querySelector('.react-flow__minimap');
    const panel = reactFlowWrapper.current.querySelector('.react-flow__panel');
    
    if (controls) controls.style.display = 'none';
    if (minimap) minimap.style.display = 'none';
    if (panel) panel.style.display = 'none';

    toPng(reactFlowWrapper.current, {
      backgroundColor: '#1a1a1a',
      width: reactFlowWrapper.current.offsetWidth,
      height: reactFlowWrapper.current.offsetHeight,
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `flowchart-question-${currentQuestion + 1}.png`;
        link.href = dataUrl;
        link.click();
        
        // Restore controls and minimap
        if (controls) controls.style.display = 'block';
        if (minimap) minimap.style.display = 'block';
        if (panel) panel.style.display = 'block';
      })
      .catch((error) => {
        console.error('Error exporting flowchart:', error);
        alert('Failed to export flowchart. Please try again.');
        
        // Restore controls and minimap even on error
        if (controls) controls.style.display = 'block';
        if (minimap) minimap.style.display = 'block';
        if (panel) panel.style.display = 'block';
      });
  }, [reactFlowWrapper, currentQuestion]);

  const uploadFlowchart = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (data.questions && Array.isArray(data.questions)) {
              const loadedCanvases = data.questions.map(q => q.canvas);
              setQuestionCanvases(loadedCanvases);
              setNodes(loadedCanvases[currentQuestion].nodes);
              setEdges(loadedCanvases[currentQuestion].edges);
            }
          } catch (error) {
            alert('Invalid flowchart file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [currentQuestion, setNodes, setEdges]);

  const nodeShapes = [
    { type: 'rectangle', label: 'Process', icon: '▭' },
    { type: 'diamond', label: 'Decision', icon: '◆' },
    { type: 'circle', label: 'Start/End', icon: '●' },
    { type: 'parallelogram', label: 'Input/Output', icon: '▱' },
    { type: 'text', label: 'Text', icon: 'T' },
  ];

  return (
    <div className="flowchart-container">
      <div className="flowchart-header">
        <h2>Flowchart Editor</h2>
        <div className="flowchart-actions">
          <button onClick={deleteSelected} className="action-btn danger" title="Delete selected">
            ❌ Delete Selected
          </button>
          
          <button onClick={downloadFlowchart} className="action-btn" title="Save as PNG image">
            💾 Save PNG
          </button>
          <button onClick={clearCanvas} className="action-btn danger" title="Clear canvas">
            🗑️ Clear All
          </button>
        </div>
      </div>

      <div className="flowchart-toolbar">
        <div className="toolbar-section">
          <span className="toolbar-label">Add Shape:</span>
          {nodeShapes.map((shape) => (
            <button
              key={shape.type}
              className={`shape-btn ${selectedNodeType === shape.type ? 'active' : ''}`}
              onClick={() => setSelectedNodeType(shape.type)}
              title={shape.label}
            >
              <span className="shape-icon">{shape.icon}</span>
              <span className="shape-label">{shape.label}</span>
            </button>
          ))}
        </div>
        <button onClick={addNode} className="add-node-btn">
          ➕ Add {selectedNodeType.charAt(0).toUpperCase() + selectedNodeType.slice(1)}
        </button>
      </div>

      {/* Question Navigation Section */}
      <div className="question-section">
        <button 
          onClick={goToPreviousQuestion} 
          disabled={currentQuestion === 0}
          className="nav-btn prev-btn"
          title="Previous Question"
        >
          ← Previous
        </button>
        
        <div className="question-display">
          <div className="question-header">
            <span className="question-number">Question {currentQuestion + 1} of {questions.length}</span>
            <div className="question-indicators">
              {questions.map((_, idx) => (
                <span 
                  key={idx}
                  className={`indicator ${idx === currentQuestion ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentQuestion(idx);
                  }}
                  title={`Go to Question ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          <h3 className="question-text">{questions[currentQuestion].text}</h3>
          <p className="question-description">{questions[currentQuestion].description}</p>
        </div>
        
        <button 
          onClick={goToNextQuestion} 
          disabled={currentQuestion === questions.length - 1}
          className="nav-btn next-btn"
          title="Next Question"
        >
          Next →
        </button>
      </div>

      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          onSelectionChange={onSelectionChange}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          deleteKeyCode={null}
          multiSelectionKeyCode="Control"
          connectionRadius={30}
          connectionMode="loose"
          snapToGrid={true}
          snapGrid={[15, 15]}
          attributionPosition="bottom-left"
        >
          <Background color="#444" gap={16} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              switch (node.type) {
                case 'rectangle': return '#667eea';
                case 'diamond': return '#f5576c';
                case 'circle': return '#00f2fe';
                case 'parallelogram': return '#fee140';
                case 'cylinder': return '#a8edea';
                case 'document': return '#fcb69f';
                case 'hexagon': return '#38f9d7';
                default: return '#666';
              }
            }}
            maskColor="rgba(0, 0, 0, 0.6)"
          />
          <Panel position="top-right" className="info-panel">
            <div className="info-text">
              💡 <strong>Tips:</strong>
              <ul>
                <li>Double-click nodes to edit text</li>
                <li>Drag from circles to connect nodes</li>
                <li>Select & press Delete/Backspace to remove</li>
                <li>Click edge and press Delete to remove connection</li>
                <li>Ctrl+Click for multi-select</li>
                <li>Use mouse wheel to zoom</li>
                <li>Drag canvas to pan</li>
              </ul>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}