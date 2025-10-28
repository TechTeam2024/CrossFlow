import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';

// Common handle style
const handleStyle = {
  background: '#FF8A00',
  width: '10px',
  height: '10px',
  border: '2px solid white',
};

// Text editor component
function TextEditor({ initialText, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText || '');

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (onSave) {
      onSave(text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    // Prevent node deletion when editing
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.stopPropagation();
    }
  };

  return (
    <div 
      onDoubleClick={handleDoubleClick}
      style={{ 
        cursor: isEditing ? 'text' : 'pointer',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isEditing ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          autoFocus
          style={{
            width: '90%',
            minHeight: '40px',
            background: 'rgba(255,255,255,0.9)',
            border: '2px solid #FF8A00',
            color: '#333',
            fontSize: '14px',
            textAlign: 'center',
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            borderRadius: '4px',
            padding: '8px',
          }}
        />
      ) : (
        <div style={{ 
          fontSize: '14px', 
          textAlign: 'center', 
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          userSelect: 'none',
          padding: '8px',
          width: '100%',
        }}>
          {text || 'Double-click to edit'}
        </div>
      )}
    </div>
  );
}

// Rectangle/Process Node
export const RectangleNode = memo(({ data, selected }) => (
  <div style={{ position: 'relative' }}>
    {/* Connection handles */}
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <Handle type="target" position={Position.Left} style={handleStyle} />
    
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: selected ? '3px solid #FF8A00' : '2px solid #5568d3',
      borderRadius: '8px',
      color: 'white',
      boxShadow: selected ? '0 0 20px rgba(255,138,0,0.5)' : '0 4px 6px rgba(0,0,0,0.3)',
      padding: '10px 15px',
      minWidth: '140px',
      minHeight: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <TextEditor 
        initialText={data?.label} 
        onSave={(newText) => data?.onLabelChange?.(newText)}
      />
    </div>
    
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
    <Handle type="source" position={Position.Right} style={handleStyle} />
  </div>
));

// Diamond/Decision Node
export const DiamondNode = memo(({ data, selected }) => {
  const [text, setText] = useState(data?.label || '');

  return (
    <div style={{ position: 'relative', width: '160px', height: '160px' }}>
      {/* Connection handles */}
      <Handle type="target" position={Position.Top} style={{ ...handleStyle, top: '20px' }} />
      <Handle type="target" position={Position.Left} style={{ ...handleStyle, left: '20px' }} />
      
      <div style={{
        width: '140px',
        height: '140px',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        border: selected ? '3px solid #FF8A00' : '2px solid #e04e5e',
        transform: 'rotate(45deg)',
        position: 'absolute',
        top: '10px',
        left: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: selected ? '0 0 20px rgba(255,138,0,0.5)' : '0 4px 6px rgba(0,0,0,0.3)',
      }}>
        <div style={{ 
          transform: 'rotate(-45deg)',
          width: '110px',
          color: 'white',
        }}>
          <TextEditor 
            initialText={data?.label} 
            onSave={(newText) => data?.onLabelChange?.(newText)}
          />
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} style={{ ...handleStyle, bottom: '20px' }} />
      <Handle type="source" position={Position.Right} style={{ ...handleStyle, right: '20px' }} />
    </div>
  );
});

// Circle/Start-End Node
export const CircleNode = memo(({ data, selected }) => (
  <div style={{ position: 'relative' }}>
    {/* Connection handles */}
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <Handle type="target" position={Position.Left} style={handleStyle} />
    
    <div style={{
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      border: selected ? '3px solid #FF8A00' : '2px solid #3a9de8',
      borderRadius: '50%',
      color: 'white',
      width: '140px',
      height: '140px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: selected ? '0 0 20px rgba(255,138,0,0.5)' : '0 4px 6px rgba(0,0,0,0.3)',
    }}>
      <TextEditor 
        initialText={data?.label} 
        onSave={(newText) => data?.onLabelChange?.(newText)}
      />
    </div>
    
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
    <Handle type="source" position={Position.Right} style={handleStyle} />
  </div>
));

// Parallelogram/Input-Output Node
export const ParallelogramNode = memo(({ data, selected }) => (
  <div style={{ position: 'relative' }}>
    {/* Connection handles */}
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <Handle type="target" position={Position.Left} style={handleStyle} />
    
    <div style={{
      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      border: selected ? '3px solid #FF8A00' : '2px solid #f85e8a',
      transform: 'skew(-20deg)',
      color: 'white',
      minWidth: '160px',
      minHeight: '80px',
      padding: '10px 15px',
      boxShadow: selected ? '0 0 20px rgba(255,138,0,0.5)' : '0 4px 6px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ transform: 'skew(20deg)', width: '100%' }}>
        <TextEditor 
          initialText={data?.label} 
          onSave={(newText) => data?.onLabelChange?.(newText)}
        />
      </div>
    </div>
    
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
    <Handle type="source" position={Position.Right} style={handleStyle} />
  </div>
));

// Cylinder/Database Node
export const CylinderNode = memo(({ data, selected }) => (
  <div style={{ position: 'relative' }}>
    {/* Connection handles */}
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <Handle type="target" position={Position.Left} style={handleStyle} />
    
    <div style={{
      background: 'linear-gradient(180deg, #a8edea 0%, #fed6e3 100%)',
      border: selected ? '3px solid #FF8A00' : '2px solid #8ed9d4',
      borderRadius: '50px 50px 10px 10px',
      color: '#333',
      minWidth: '140px',
      minHeight: '100px',
      padding: '15px',
      boxShadow: selected ? '0 0 20px rgba(255,138,0,0.5)' : '0 4px 6px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <TextEditor 
        initialText={data?.label} 
        onSave={(newText) => data?.onLabelChange?.(newText)}
      />
    </div>
    
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
    <Handle type="source" position={Position.Right} style={handleStyle} />
  </div>
));

// Document Node
export const DocumentNode = memo(({ data, selected }) => (
  <div style={{ position: 'relative' }}>
    {/* Connection handles */}
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <Handle type="target" position={Position.Left} style={handleStyle} />
    
    <div style={{
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      border: selected ? '3px solid #FF8A00' : '2px solid #f5a88a',
      borderRadius: '8px 8px 50% 50%',
      color: '#333',
      minWidth: '150px',
      minHeight: '100px',
      padding: '15px',
      boxShadow: selected ? '0 0 20px rgba(255,138,0,0.5)' : '0 4px 6px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <TextEditor 
        initialText={data?.label} 
        onSave={(newText) => data?.onLabelChange?.(newText)}
      />
    </div>
    
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
    <Handle type="source" position={Position.Right} style={handleStyle} />
  </div>
));

// Hexagon Node
export const HexagonNode = memo(({ data, selected }) => (
  <div style={{ position: 'relative', width: '180px', height: '160px' }}>
    {/* Connection handles */}
    <Handle type="target" position={Position.Top} style={{ ...handleStyle, top: '10px' }} />
    <Handle type="target" position={Position.Left} style={{ ...handleStyle, left: '20px' }} />
    
    <svg width="180" height="160" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#43e97b', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#38f9d7', stopOpacity: 1 }} />
        </linearGradient>
        <filter id="hexShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3"/>
        </filter>
      </defs>
      <polygon 
        points="90,15 155,52 155,118 90,155 25,118 25,52" 
        fill="url(#hexGradient)"
        stroke={selected ? '#FF8A00' : '#32d9b7'}
        strokeWidth={selected ? '3' : '2'}
        filter="url(#hexShadow)"
      />
      <foreignObject x="35" y="60" width="110" height="50">
        <div style={{
          color: '#333',
          fontSize: '14px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}>
          <TextEditor 
            initialText={data?.label} 
            onSave={(newText) => data?.onLabelChange?.(newText)}
          />
        </div>
      </foreignObject>
    </svg>
    
    <Handle type="source" position={Position.Bottom} style={{ ...handleStyle, bottom: '10px' }} />
    <Handle type="source" position={Position.Right} style={{ ...handleStyle, right: '20px' }} />
  </div>
));

RectangleNode.displayName = 'RectangleNode';
DiamondNode.displayName = 'DiamondNode';
CircleNode.displayName = 'CircleNode';
ParallelogramNode.displayName = 'ParallelogramNode';
CylinderNode.displayName = 'CylinderNode';
DocumentNode.displayName = 'DocumentNode';
HexagonNode.displayName = 'HexagonNode';
