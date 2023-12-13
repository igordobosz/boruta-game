import { useEffect, useState } from 'react';
import { Typography, Flex, Card, Space, Button } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
import questionsJson from './questions.json';
import shuffle from './Misc';

const { Title } = Typography;

function App() {
  document.title = 'Boruta Christmas Game';
  const [questions, setQuestions] = useState(new Map());
  const [order, setOrder] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const reset = () => {
    setIsLoading(true);
    setOrder(shuffle([...questions.keys()]));
    setCurrentIndex(0);
    setIsLoading(false);
    setIsEnd(false);
    localStorage.removeItem('save');
  };

  const changeIndex = (forward) => {
    let newIndex = forward === true ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0) {
      newIndex = 0;
    }

    if (newIndex >= order.length) {
      setIsEnd(true);
      newIndex = 0;
    }

    setCurrentIndex(newIndex);
    save(newIndex);
  };

  useEffect(() => {
    setIsLoading(true);
    var questionsMap = new Map(questionsJson.map((val, i) => [i, val]));
    setQuestions(questionsMap);
    var save = localStorage.getItem('save');
    var saveJson = JSON.parse(save);
    if (saveJson?.questionsCount !== questions.size) {
      saveJson = null;
    }
    var order = saveJson?.order ?? shuffle([...questionsMap.keys()]);
    setOrder(order);
    var currentIndex = saveJson?.currentIndex ?? 0;
    setCurrentIndex(currentIndex);
    setIsLoading(false);
  }, []);

  const save = (currentIndex) => {
    var save = JSON.stringify({
      currentIndex: currentIndex,
      order: order,
      questionsCount: questions.size,
    });
    localStorage.setItem('save', save);
  };

  return (
    <Flex gap="center" align="center" vertical style={{ width: '100%' }}>
      <main>
        <Space direction="vertical">
          <Title style={{ textAlign: 'center' }}>Boruta Christmas Game</Title>
          <Card style={{ height: 300 }}>
            <Title level={2} style={{ textAlign: 'left' }}>
              {isLoading && <p>Misza sortuje karty..</p>}
              {isEnd && <p>Koniec!</p>}
              {!isLoading && !isEnd && (
                <p>{questions.get(order[currentIndex])}</p>
              )}
            </Title>
          </Card>
          {!isLoading && (
            <>
              <Button
                onClick={() => changeIndex(true)}
                type="primary"
                size="large"
                icon={<RocketOutlined />}
                block
              >
                Next
              </Button>
              <Button
                onClick={() => changeIndex(false)}
                type="primary"
                size="large"
                icon={<RocketOutlined />}
                block
              >
                Previous
              </Button>
              <Button
                onClick={() => reset()}
                type="primary"
                size="large"
                icon={<RocketOutlined />}
                block
              >
                Reset
              </Button>
            </>
          )}
        </Space>
      </main>
    </Flex>
  );
}

export default App;
