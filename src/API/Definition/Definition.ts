import http from '@/common/http';
import API from '@/API';
import Auth from '@/common/auth';

const Definition = {
    async getAllDefinitions(): Promise<Definition[]> {
        const response = await http.get('asset/definitions');
        const definitions = JSON.parse(JSON.stringify(response.data));
        return definitions;
    },
    async getDefinitionsByCategory(pcategory: string): Promise<Definition[]> {
        const response = await http.get(
        'asset/definitions', {
        params: {
            category: pcategory,
        },
        });
        const filteredDefinitions = JSON.parse(JSON.stringify(response.data));
        return filteredDefinitions;
    },
};

export default Definition;
