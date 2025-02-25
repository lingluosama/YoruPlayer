import React, { useState } from 'react';

const Checkbox = ({ label, checked, onCheckedChange }) => {
    const [isChecked, setIsChecked] = useState(checked);

    const handleChange = (event) => {
        const newChecked = event.target.checked;
        setIsChecked(newChecked);
        onCheckedChange(newChecked);
    };

    return (
        <label className="relative inline-flex items-center cursor-pointer">
            {/* 隐藏的原生复选框 */}
            <input
                type="checkbox"
                className="peer opacity-0 absolute h-0 w-0"
                checked={isChecked}
                onChange={handleChange}
            />

            <div className="
        relative
        w-5 h-5
        border-2 border-gray-400
        rounded-sm
        transition-all
        duration-200
        peer-checked:bg-blue-500
        peer-checked:border-blue-600
        peer-checked:[&>svg]:opacity-100
        peer-checked:[&>svg]:scale-100
      ">
                {/* 勾选图标 SVG */}
                <svg
                    className="
            absolute inset-0
            text-white
            opacity-0
            scale-50
            transition-all
            duration-200
          "
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                >
                    {/* 勾选路径 */}
                    <path
                        d="M4 12.6L9 17.6L20 6.6"
                        className="origin-center"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* 标签文字 */}
            <span className="ml-2 text-gray-700">{label}</span>
        </label>
    );
};

export default Checkbox;
