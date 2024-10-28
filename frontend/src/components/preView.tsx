import React from 'react';
import '../assets/css/componentsCss/preView.css';
// Definición de tipos
interface Field {
    name: string;
    type: string;
    required: boolean;
    fields?: Field[]; // Campos anidados opcionales
}

interface SchemaPreviewProps {
    modelName: string;
    fields: Field[];
}
const SchemaPreview: React.FC<SchemaPreviewProps> = ({ modelName, fields }) => {
    const renderFields = (fields: Field[], indentLevel = 1): string => {
        const indent = '    '.repeat(indentLevel);
        return fields.map((field) => {
            const requiredText = field.required ? 'true' : 'false';
            const nestedFields = field.fields && field.fields.length > 0 
                ? `,\n${indent}fields: [\n${renderFields(field.fields, indentLevel + 1)}\n${indent}]\n`
                : '';
            return `${indent}${field.name}: { type: ${field.type}, required: ${requiredText}${nestedFields} }`;
        }).join(',\n');
    };

    return (
        <div className="schema-preview">
            <pre>
                {`${modelName} = ({\n`}{renderFields(fields)}{`\n});`}
            </pre>
        </div>
    );
};

export default SchemaPreview;
