import { Flex, Grid } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { orderChannel } from '../../channels';
import { ActiveOrder } from '../../contexts/OrderManager';
import { PosSidebarCustomer } from './components/PosSidebarCustomer';

export const CustomerScreen: React.FunctionComponent = () => {
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | undefined>();
  const ref = useRef(null);
  const setUpYoutube = () => {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/player_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    (firstScriptTag as any).parentNode.insertBefore(tag, firstScriptTag);
    var player;
    function onYouTubePlayerAPIReady() {
      const playYoutube = setInterval(() => {
        // @ts-ignore
        if (typeof YT !== 'undefined') {
          // @ts-ignore
          player = new YT.Player(ref.current, {
            height: '100%',
            width: '100%',
            videoId: 'em_g2H8heP4',
            events: {
              onReady: onPlayerReady,
              onStateChange: onPlayerStateChange,
            },
            playerVars: {
              autoplay: 1,
              mute: 1,
              loop: 1,
              playlist: 'em_g2H8heP4',
            },
          });
          clearInterval(playYoutube);
        }
      }, 1000);
    }
    // @ts-ignore
    function onPlayerReady(event) {
      event.target.playVideo();
    }
    var done = false;
    // @ts-ignore
    function onPlayerStateChange(event) {
      // @ts-ignore
      if (event.data === YT.PlayerState.PLAYING && !done) {
        done = true;
      }
    }
    onYouTubePlayerAPIReady();
  };
  useEffect(() => {
    setUpYoutube();
    orderChannel.onmessage = (e) => {
      if (e.data.type === 'ACTIVE_ORDER_CHANGED') {
        setActiveOrder(e.data.payload);
      }
    };
    return () => {
      orderChannel.close();
    };
  }, []);
  return (
    <Grid
      templateColumns={['1fr 1fr', '1fr 1fr', '1fr 1fr', '2fr 1fr']}
      h="100vh"
    >
      <Flex overflow="hidden" flexDir="column">
        <div id="player" ref={ref} />
      </Flex>
      <Flex overflow="hidden" bg="gray.50" flexDir="column">
        {activeOrder && <PosSidebarCustomer activeOrder={activeOrder} />}
      </Flex>
    </Grid>
  );
};

export default CustomerScreen;
