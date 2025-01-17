import { useCallback, useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Portis from "@portis/web3";

// Enter a valid infura key here to avoid being rate limited
// You can get a key for free at https://infura.io/register
const INFURA_ID = "10c3a0fa44b94deba2a896658844a49c";
const PORTIS_ID = "d8d084c2-9c3a-403a-a937-5542d6d680bb";
const NETWORK_NAME = "mainnet";

function useWeb3Modal(config = {}) {
  const [provider, setProvider] = useState();
  const [autoLoaded, setAutoLoaded] = useState(false);
  const { autoLoad = true, infuraId = INFURA_ID, NETWORK = NETWORK_NAME } = config;
  // Web3Modal also supports many other wallets.
  // You can see other options at https://github.com/Web3Modal/web3modal
  const web3Modal = new Web3Modal({
    network: NETWORK,
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId,
          rpc:{
            56: "https://bsc-dataseed1.defibit.io",
            137: "https://polygon-rpc.com/",
            100: "https://xdai.poanetwork.dev",
          }
        },
      },
      portis: {
        package: Portis, // required
        options: {
          id: PORTIS_ID
        }
      }
    },
  });

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    let newProvider
    try{
      newProvider = await web3Modal.connect();
    }catch(e){
      console.log('***loadWeb3Modal error', {e})
    }
    setProvider(new Web3Provider(newProvider));
  }, [web3Modal]);

  const logoutOfWeb3Modal = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      window.location.reload();
    },
    [web3Modal],
  );

  // If autoLoad is enabled and the the wallet had been loaded before, load it automatically now.
  useEffect(() => {
    if (autoLoad && !autoLoaded && web3Modal.cachedProvider) {
      loadWeb3Modal();
      setAutoLoaded(true);
    }
  }, [autoLoad, autoLoaded, loadWeb3Modal, setAutoLoaded, web3Modal.cachedProvider]);
  // }, []);
  return [provider, loadWeb3Modal, logoutOfWeb3Modal];
}

export default useWeb3Modal;
