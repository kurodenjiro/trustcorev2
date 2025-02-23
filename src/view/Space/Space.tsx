import React, { useEffect, useState } from "react";
import styled from "styled-components";

// @styled-component
import { Layout, MainLayout, ItemLayout, Title } from "./Space.styled";
import { Wallet } from "near/near-wallet";
// @component
import { Spaces } from "components/Items";
import Container from "components/Container/Container";

// @assets
import { FaPlus } from "react-icons/fa";
import Image1 from "assets/png/img1.webp";
import Image2 from "assets/png/uniswap.webp";
import Image3 from "assets/png/pancakeswap.png";
import Image4 from "assets/png/theopendao.webp";
import Image5 from "assets/png/Edu.png";
import Image6 from "assets/png/op.png";
import { create } from "domain";

const NameSpace = styled.input`
  width: 100%;
  background: white;
  padding: 8px;
  border: 2px solid;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const IdSpace = styled.input`
  width: 100%;
  padding: 8px;
  background: white;
  border: 2px solid;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  border: 6px solid;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
    margin-left:20px;
    font-size: 14px;
    color: black;
    text-transform: uppercase;
    padding: 10px 20px;
    border-radius: 24px;
    border: 2px solid;
    background: #7efefe;
    box-shadow: 5px 5px black;
    cursor: pointer;
    margin: 35px 10px;

    &:active {
      box-shadow: none;
      transform: translate(3px, 3px);
    `;
const ButtonCreate = styled.button`
      height:60px;
      font-size: 14px;
      color: black;
      text-transform: uppercase;
      padding: 10px 20px;
      border-radius: 24px;
      border: 2px solid;
      background: #7efefe;
      box-shadow: 5px 5px black;
      cursor: pointer;
      margin: 35px 0;

      &:active {
        box-shadow: none;
        transform: translate(3px, 3px);
      `;

const ButtonCreated = styled.button`
    margin-right:20px;
    font-size: 14px;
    color: black;
    text-transform: uppercase;
    padding: 10px 20px;
    border-radius: 24px;
    border: 2px solid;
    background: #7efefe;
    box-shadow: 5px 5px black;
    cursor: pointer;
    margin: 35px 0;

    &:active {
      box-shadow: none;
      transform: translate(3px, 3px);
    `;

    export default function index() {
      // When creating the wallet you can optionally ask to create an access key
      // Having the key enables to call non-payable methods without interrupting the user to sign
    
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [spaceName, setSpaceName] = useState("");
      const contractId: any = process.env.NEXT_PUBLIC_CONTRACT_NAME;
      const wallet = new Wallet({ createAccessKeyFor: contractId as any });
      const openModal = () => {
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
      };
      const createSpace = async() => {
        await wallet.startUp();
        await wallet.callMethod({
          method: "create_space",
          args: { space_name: spaceName },
          contractId,
        });
        const spacesData = await wallet.viewMethod({
          method: "get_all_spaces",
          contractId,
        });
        const spaceArr: any = [];
        spacesData.forEach((item:any) => {
          spaceArr.push({
            ...item,
            image: Image5,
            connect: [{ icon: FaPlus, link: `/space/${item.space_id}` }],
          });
        });
        setSpaces(spaceArr);
        setIsModalOpen(false);
      };
      const [spaces, setSpaces] = useState([]);
      const [walletState, setWalletState] = useState(null);
    
      useEffect(() => {
        const contractId: any = process.env.NEXT_PUBLIC_CONTRACT_NAME;
        const wallet = new Wallet({ createAccessKeyFor: contractId });
        setWalletState(wallet as any);
        const startUp = async () => {
          const isSignedIn = await wallet.startUp();
          const spacesData = await wallet.viewMethod({
            method: "get_all_spaces",
            contractId,
          });
          const spaceArr: any = [];
          spacesData.forEach((item:any) => {
            spaceArr.push({
              ...item,
              image: Image5,
              connect: [{ icon: FaPlus, link: `/space/${item.space_id}` }],
            });
          });
          setSpaces(spaceArr);
        };
    
        startUp().catch(console.error);
      }, []);
    
      return (
        <Layout id="space">
          <Container>
            <Title>Spaces</Title>
            <ButtonCreate onClick={openModal}>Create Space</ButtonCreate>
            <br />
            <br />
            <br />
            <MainLayout>
              {spaces &&
                spaces.map((item:any, index:any) => (
                  <ItemLayout key={index}>
                    <Spaces data={item} wallet={walletState} />
                  </ItemLayout>
                ))}
            </MainLayout>
          </Container>
          {isModalOpen && (
            <Overlay id="modalOverlay">
              <Modal>
                <ModalContent>
                  <NameSpace type="text" placeholder="Name" value={spaceName} onChange={(e) => setSpaceName(e.target.value)}/>
                  <ButtonCreated onClick={createSpace} >Create</ButtonCreated>
                  <Button onClick={closeModal}>Cancel</Button>
                </ModalContent>
              </Modal>
            </Overlay>
          )}
        </Layout>
      );
    }
    