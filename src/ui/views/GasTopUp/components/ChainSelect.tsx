import LessPalette from '@/ui/style/var-defs';
import { Space } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as SvgIconArrowDownTriangle } from '@/ui/assets/swap/arrow-caret-down.svg';
import Modal from '@/ui/component/ChainSelector/Modal';
import { CHAINS, CHAINS_ENUM } from '@/constant';
import { SelectChainListProps } from '@/ui/component/ChainSelector/components/SelectChainList';

export const ChainWrapper = styled.div`
  background: ${LessPalette['@color-bg']};
  border-radius: 4px;
  padding: 16px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border: 1px solid transparent;

  &:hover {
    border-color: #8697ff;
  }

  & .icon {
    width: 32px;
    height: 32px;
    border-radius: 9999px;
    margin-right: 12px;
  }
  & .text {
    font-weight: 500;
    font-size: 20px;
    line-height: 23px;
    color: #13141a;
  }
`;

interface ChainSelectProps {
  value: CHAINS_ENUM;
  onChange?(value: CHAINS_ENUM): void;
  readonly?: boolean;
  showModal?: boolean;
  direction?: 'top' | 'bottom';
  type?: SelectChainListProps['type'];
}
export const ChainSelect = ({
  value,
  onChange,
  readonly = false,
  showModal = false,
  type = 'default',
}: ChainSelectProps) => {
  const [showSelectorModal, setShowSelectorModal] = useState(showModal);

  const handleClickSelector = () => {
    if (readonly) return;
    setShowSelectorModal(true);
  };

  const handleCancel = () => {
    if (readonly) return;
    setShowSelectorModal(false);
  };

  const handleChange = (value: CHAINS_ENUM) => {
    if (readonly) return;
    onChange && onChange(value);
    setShowSelectorModal(false);
  };
  return (
    <>
      <ChainWrapper onClick={handleClickSelector}>
        <div className="flex items-center justify-center">
          <img className="icon ml-[4px] mr-[12px]" src={CHAINS[value].logo} />
          <span className="text">{CHAINS[value].name}</span>
        </div>
        {!readonly && <SvgIconArrowDownTriangle width={24} height={24} />}
      </ChainWrapper>
      {!readonly && (
        <Modal
          value={value}
          visible={showSelectorModal}
          onChange={handleChange}
          onCancel={handleCancel}
          type={type}
        />
      )}
    </>
  );
};
